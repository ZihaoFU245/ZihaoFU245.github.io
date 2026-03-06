---
layout: single
title: "DIY Raspberry pi router tutorial, mt7925 used"
author_profile: true
date: 2026-3-05
categories:
  - general
classes: wide
header:
  teaser: "/assets/2026-03-05-resources/2.avif"
---

> I have made a raspberry pi router, with raspi 5 and a wifi card.

Achieved **WIFI6** and **UPnP**, boost my throughput near the limit of ethernet bandwidth.

What's more? Symmetric NAT (eduroam) => Port Restricted NAT with UPnP.

<!-- markdownlint-disable MD033 -->

<figure style="text-align:center;">
  <img src="/assets/2026-03-05-resources/2.avif" alt="Pi router" style="width:50%;max-width:440px;display:block;margin:0 auto;" />
</figure>
<div style="text-align:center; font-size:0.85rem;color:#64748b;margin-top:.4rem;">My setup</div>

## How to make a router with raspberry pi?

### Introduction

- Software used: 
1. **Hostapd**: control wifi interfaces, handle signal broadcasting, WPA authentication.
2. **Dnsmasq / pihole**: Both Dnsmasq and pihole can be used as a DHCP server (assign ips), and DNS server.
I use pihole for DNS only(port 53) and Dnsmasq for DHCP (port 67)
3. **Miniupnp**: miniupnpd is used for UPnP capability for P2P connection.
4. **nftables**: Linux firewall, iptables is complicated to use and ufw lack of thorough control. Miniupnpd works great with nftables.

- Steps, Sections:
1. [Driver handling](#Driver)
2. [Hostapd installation](#Hostapd)
3. [Configure pihole and dnsmasq](#DHCP)
4. [UPnP setup](#UPnP)
5. [Benchmarking](#Benchmark)
6. [Hardware selections](#Hardware)

### Hardware List

- Raspberry pi 5 8Gb
- mt7925 MediaTek wifi card or any wifi card you have
- A Raspberry pi HAT: PCIe to M.2 Key E
- 2 antennas

Assemble the hardware before you continue.

## 1. Check wifi card compatibility {#Driver}

My wifi card mt7925 is not fully supported on raspberry pi OS with kernel 6.12.y. I plugged it in,
and wifi interface did not show up. If you are on newer kernels, it might work out of the box. I could only rebuild the kernel myself. Below is
how you would build it.

> If your wifi card driver works, you can find it in `ip addr`, skip this step.

If you are using Intel cards, like BE200 and AX210 they are likely supported. You would
find the interface, usually called `wlan1` in `ip a` command. However, intel cards are
good for client mode, AP mode is not good as MediaTek.

> [Mediatek MT7925e fails to probe/bind on Raspberry Pi 5 PCIe bus with error -12](https://github.com/raspberrypi/linux/issues/7046#issuecomment-3794631559)
By March 6, 2026, the kernel does not include support for mt7925.

> [Raspberry pi official documentation on how to build custom kernel](https://www.raspberrypi.com/documentation/computers/linux_kernel.html#building)

### Check PCIe

```bash
zihao@hkg:~ $ lspci
0001:00:00.0 PCI bridge: Broadcom Inc. and subsidiaries BCM2712 PCIe Bridge (rev 30)
0001:01:00.0 Network controller: MEDIATEK Corp. MT7925 (RZ717) Wi-Fi 7 160MHz
0002:00:00.0 PCI bridge: Broadcom Inc. and subsidiaries BCM2712 PCIe Bridge (rev 30)
0002:01:00.0 Ethernet controller: Raspberry Pi Ltd RP1 PCIe 2.0 South Bridge
```
You need `MEDIATEK Corp. MT7925` appear here.

### Fetch kernel source, prepare

```bash
sudo apt update
sudo apt install -y git bc bison flex libssl-dev ccache make \
  libncurses-dev dwarves rsync

git clone --depth 1 https://github.com/raspberrypi/linux.git
cd linux

make bcm2712_defconfig
make olddefconfig
make menuconfig
```
In make menuconfig, Device Drivers -> Wireless LAN -> MediaTek mt7925 support.
Mark then as M, as a kernel loadable module.

`grep MT7925 .config` make sure you have them.

### Compile

```bash
make -j$(nproc) Image modules dtbs
```
Wait for it to finish.

- Install

```bash
sudo cp /boot/firmware/kernel_2712.img /boot/firmware/kernel_2712.img.bak.$(date +%F-%H%M)
sudo cp arch/arm64/boot/Image /boot/firmware/kernel_2712.img
sudo make modules_install
sudo make dtbs_install
sudo depmod -a
```
You also need to add `dtoverlay=pcie-32bit-dma-pi5` in `[all]` section, in `/boot/firmware/config.txt`.
After that `sudo reboot`.

### Verify

```bash
zihao@hkg:~ $ ip a show wlan1
4: wlan1: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 84:9e:56:9c:71:a5 brd ff:ff:ff:ff:ff:ff
    inet 192.168.50.1/24 scope global wlan1
       valid_lft forever preferred_lft forever
    inet6 fe80::869e:56ff:fe9c:71a5/64 scope link proto kernel_ll 
       valid_lft forever preferred_lft forever
```
If you see an interface appeared, then issue is solved. On Raspberry pi OS, nmcli should automatically manage this interface, and is set to client mode. Above illustration is already set to AP mode.

## 2. Set to AP mode {#Hostapd}

- Unmanage from nmcli

```bash
zihao@hkg:~ $ cd /etc/NetworkManager/conf.d
zihao@hkg:/etc/NetworkManager/conf.d $ ls
10-unmanage-wlan1.conf
zihao@hkg:/etc/NetworkManager/conf.d $ cat 10-unmanage-wlan1.conf
[keyfile]
unmanaged-devices=interface-name:wlan1
```

### Install hostapd

1. Through apt
```bash
sudo apt install hostapd
```

2. Self build if you need recent features 
```bash
sudo apt update
sudo apt install -y \
  build-essential pkg-config git \
  libnl-3-dev libnl-genl-3-dev \
  libssl-dev libsqlite3-dev
git clone https://w1.fi/hostap.git
cd hostap/hostapd
cp defconfig .config
nano .config
```

set your needed feature in `.config`, eg. `CONFIG_SAE=y`. 
The default config is generally complete, for wifi7, IEEE 802.11be is default to y

```bash
make -j$(nproc)
```

Place build out `hostapd` to a location, like `/usr/local/bin`,
then add a systemd unit file.

```bash
zihao@hkg:~ $ sudo systemctl cat hostapd
# /etc/systemd/system/hostapd.service
[Unit]
Description=Hostapd IEEE 802.11 AP and authentication server
Wants=network-online.target
After=network-online.target

[Service]
Type=forking
User=root
Group=root

ExecStart=/usr/local/bin/hostapd -B -P /run/hostapd.pid /etc/hostapd/hostapd.conf
ExecReload=/bin/kill -HUP $MAINPID

PIDFile=/run/hostapd.pid
Restart=on-failure
RestartSec=2

[Install]
WantedBy=multi-user.target
```

Create a conf file, `/etc/hostapd/hostapd.conf`

```conf
interface=wlan1
driver=nl80211

ssid=WIFI_NAME
country_code=ES
ieee80211d=1
ieee80211h=1

hw_mode=a
channel=36

wmm_enabled=1

ieee80211n=1
ieee80211ac=1
ieee80211ax=1
# ieee80211be=1 # 6.12 kernel still lack of support for this. 

ht_capab=[HT40+][SHORT-GI-20][SHORT-GI-40]

vht_oper_chwidth=1
vht_oper_centr_freq_seg0_idx=42
vht_capab=[SHORT-GI-80][RXLDPC][TX-STBC-2BY1][SU-BEAMFORMEE][MU-BEAMFORMEE]

he_oper_chwidth=1
he_oper_centr_freq_seg0_idx=42

# ===== Security: WPA3-SAE only =====
auth_algs=1
wpa=2
wpa_key_mgmt=SAE
rsn_pairwise=CCMP

# PMF required for WPA3
ieee80211w=2

# SAE H2E (recommended). If some clients fail, try sae_pwe=0
sae_pwe=1

wpa_passphrase=YOUR_PASSWORD
```

### Start hostapd

```bash
sudo systemctl enable --now hostapd
sudo systmectl status hostapd
```

Expecting something like this:
```bash
zihao@hkg:~ $ sudo systemctl status hostapd
● hostapd.service - Hostapd IEEE 802.11 AP and authentication server
     Loaded: loaded (/etc/systemd/system/hostapd.service; enabled; preset: enabled)
     Active: active (running) since Tue 2026-03-03 20:17:58 HKT; 2 days ago
 Invocation: 827f7ab3d457451c857c0bf0c4bf72d1
   Main PID: 22706 (hostapd)
      Tasks: 1 (limit: 9583)
        CPU: 951ms
     CGroup: /system.slice/hostapd.service
             └─22706 /usr/local/sbin/hostapd -B -P /run/hostapd.pid /etc/hostapd/hostapd.conf

Mar 06 01:13:07 hkg hostapd[22706]: wlan1: STA 56:44:77:0d:1d:39 IEEE 802.11: disassociated due to in>
Mar 06 01:13:08 hkg hostapd[22706]: wlan1: STA 56:44:77:0d:1d:39 IEEE 802.11: deauthenticated due to >
Mar 06 05:01:18 hkg hostapd[22706]: wlan1: STA 56:44:77:0d:1d:39 IEEE 802.11: deauthenticated due to >
Mar 06 09:44:03 hkg hostapd[22706]: wlan1: STA 56:44:77:0d:1d:39 IEEE 802.11: associated (aid 4)
Mar 06 09:44:03 hkg hostapd[22706]: wlan1: STA 56:44:77:0d:1d:39 RADIUS: starting accounting session >
Mar 06 09:44:03 hkg hostapd[22706]: wlan1: STA 56:44:77:0d:1d:39 WPA: pairwise key handshake complete>
Mar 06 09:50:23 hkg hostapd[22706]: wlan1: STA 56:44:77:0d:1d:39 IEEE 802.11: disassociated
```

Now the hostapd is finished setting up. Your wifi can be discovered, but with out of DHCP, you can't use it yet.

## 3. Dnsmasq and Pihole {#DHCP}

```bash
sudo apt install dnsmasq

curl -sSL https://install.pi-hole.net | sudo bash
```

This installs dnsmasq and pihole.

Create `/etc/dnsmasq.d/dhcp.conf`

Example config:
```conf
# DHCP only for AP
interface=wlan1
bind-interfaces

# DO NOT provide DNS service (Pi-hole owns :53)
port=0

dhcp-range=192.168.50.50,192.168.50.200,255.255.255.0,12h
dhcp-option=option:router,192.168.50.1      # You are free to choose private ip address ranges
dhcp-option=option:dns-server,192.168.50.1

log-dhcp
```

For pihole, you can find configuration at `/etc/pihole`, do additional tuning if you want.

From now on, your wifi is functioning. Remember if you are using a firewall, open port 53, 67 on `wlan1`.

## 4. Miniupnpd {#UPnP}

> UPnP: Universal Plug and Play. It can open ports on firewall automatically. Works great for Game consoles, bitTorrent, tailscale, etc. Offering direct connection capabilities, but requires security
enforcements during set up.

### Installation
```bash
sudo apt install miniupnpd nftables
sudo apt remove ufw
# Do no let ufw modify firewall from now on. Control nftbales entirely.
```

### Setup

Below showed debian miniupnpd unit file.
```bash
zihao@hkg:~ $ sudo systemctl  cat miniupnpd
# /usr/lib/systemd/system/miniupnpd.service
[Unit]
Description=Lightweight UPnP IGD & PCP/NAT-PMP daemon
Documentation=man:miniupnpd(8)
After=network-online.target

[Service]
Type=forking
EnvironmentFile=-/etc/default/miniupnpd
ExecStartPre=/usr/libexec/miniupnpd-startstop-helper.sh start
ExecStart=/usr/sbin/miniupnpd -f /etc/miniupnpd/miniupnpd.conf $MiniUPnPd_OTHER_OPTIONS
ExecStopPost=/usr/libexec/miniupnpd-startstop-helper.sh stop
PIDFile=/run/miniupnpd.pid

# #1033012, do not make TasksMax too harsh
TasksMax=16
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_BROADCAST CAP_NET_RAW CAP_SYSLOG
MountAPIVFS=yes
NoNewPrivileges=yes
PrivateMounts=yes
PrivateDevices=yes
PrivateTmp=yes
MemoryDenyWriteExecute=yes
ProtectSystem=full
ProtectHome=yes
ProtectHostname=yes
ProtectClock=yes
ProtectKernelTunables=yes
ProtectKernelModules=yes
ProtectKernelLogs=yes
ProtectControlGroups=yes
LockPersonality=yes
RestrictRealtime=yes
RestrictNamespaces=yes
RestrictSUIDSGID=yes

[Install]
WantedBy=multi-user.target
```
Notice that there is a `miniupnpd-startstop-helper.sh` and `miniupnpd-startstop-helper.sh`
shell script executed during startup and stop. 

Both of the scripts will invoke helper scritps located at `/etc/miniupnpd`
```bash
zihao@hkg:/etc/miniupnpd $ ls
miniupnpd.conf          nft_delete_chain.sh  nft_init.sh
miniupnpd_functions.sh  nft_flush.sh         nft_removeall.sh
```

The debian shipped miniupnp with these scripts contains **hard coded** value.
Before exec an inet table called `filter` with priority 0 is created. If you have your own
custom table, named `filter` will be overrided. Or for example, you have a table called `my_table`
in nft and is loaded, after miniupnpd started, it will inject it's own table, called `filter`
with default drop. Your client connected to this wifi, all packets can not be forwarded to `eth0`.

My suggestion is modify the content these shell scripts. Delete parts where it create/delete
filter tables. And in `/etc/miniupnpd/miniupnpd.conf` set `upnp_table_name` and `upnp_nat_table_name`
to your created table.

Eg.
```bash
# table names for netfilter nft. Default is "filter" for both
upnp_table_name=filter
upnp_nat_table_name=filter
# chain names for netfilter and netfilter nft
# netfilter : default are MINIUPNPD, MINIUPNPD, MINIUPNPD-POSTROUTING
# netfilter nft : default are miniupnpd, prerouting_miniupnpd, postrouting_miniupnpd
upnp_forward_chain=forwardUPnP
upnp_nat_chain=UPnP
upnp_nat_postrouting_chain=UPnP_Postrouting
upnp_nftables_family_split=no
```

Before you start, make sure nftables contain these fields.

Example `/etc/nftbales.conf`
```conf
#!/usr/sbin/nft -f

add table inet filter
flush table inet filter

table inet filter {

    # ---------- FILTER ----------
    chain input {
        type filter hook input priority 0; policy drop;

        iif "lo" accept
        ct state established,related accept # Make it a stateful firewall

        # WAN services goes here

        # LAN -> router services
        # 67 DNCP; 53 DNS; 1900 and 5351 for UPnP;
        iif "wlan1" udp dport {67,53,1900,5351} accept
        iif "wlan1" tcp dport 53 accept

        ip protocol icmp accept
        ip6 nexthdr ipv6-icmp accept
    }

    chain forward {
        type filter hook forward priority 0; policy drop;

        ct state established,related accept

        # Let miniupnpd-installed ACCEPT rules for forwarded mappings be evaluated
        jump forwardUPnP

        # Normal routing
        iif "wlan1" oif "eth0" accept
        iif "tailscale0" oif "wlan1" accept
        iif "wlan1" oif "tailscale0" accept

        # Allow DNATed flows (UPnP port-forwards) after prerouting
        iif "eth0" oif "wlan1" ct status dnat accept

        ip protocol icmp accept
    }

    chain output {
        type filter hook output priority 0; policy accept;
    }

    # miniupnpd will add/remove rules here:
    chain forwardUPnP { }


    # ---------- NAT ----------
    # miniupnpd will add DNAT rules in UPnP (jumped from prerouting)
    chain prerouting {
        type nat hook prerouting priority dstnat; policy accept;
        jump UPnP
    }

    # miniupnpd will add SNAT helper rules here if needed
    chain postrouting {
        type nat hook postrouting priority srcnat; policy accept;

        # allow miniupnpd to do its nat postrouting work first
        jump UPnP_Postrouting

        # your masquerade rules
        oif "eth0" ip saddr 192.168.50.0/24 masquerade
        oif "tailscale0" ip saddr 192.168.50.0/24 masquerade
    }

    # miniupnpd will add DNAT rules here:
    chain UPnP { }

    # miniupnpd will add nat-postrouting rules here:
    chain UPnP_Postrouting { }
}
```

### Security Tips

In `/etc/miniupnpd/miniupnpd.conf`, check this part
```bash
# UPnP permission rules (also enforced for NAT-PMP and PCP) for IPv4
# (allow|deny) (external port range) IP/mask (internal port range) (optional regex filter)
# A port range is <min port>-<max port> or <port> if there is only
# one port in the range.
# IP/mask format must be nnn.nnn.nnn.nnn/nn
# Regex support must be enabled at build time : ./configure --regex
# It is advised to only allow redirection of ports >= 1024
# and end the rule set with "deny 0-65535 0.0.0.0/0 0-65535"
# The following default ruleset allows specific LAN side IP addresses
# to request only ephemeral ports. It is recommended that users
# modify the IP ranges to match their own internal networks, and
# also consider implementing network-specific restrictions
# CAUTION: failure to enforce any rules may permit insecure requests to be made!
#allow 1024-65535 192.168.0.0/24 1024-65535
# disallow requests whose description string matches the given regex
# deny 1024-65535 192.168.1.0/24 1024-65535 "My evil app ver [[:digit:]]*"
#allow 1024-65535 192.168.1.0/24 1024-65535
#allow 1024-65535 192.168.0.0/23 22
#allow 12345 192.168.7.113/32 54321
#deny 0-65535 0.0.0.0/0 0-65535

allow 1024-65535 192.168.50.0/24 1024-65535
deny 0-65535 0.0.0.0/0 0-65535
```
Ensure that only your lan clients are able to to add UPnP rules.

Run `sudo systemctl enable --now miniupnpd` to start.

### Final Check

Run `sudo nft list ruleset`, you should a filter table that is non empty with rules inside.
```conf
table inet filter {
	chain input {
		type filter hook input priority filter; policy drop;
		iif "lo" accept
		ct state established,related accept
		iif "eth0" udp dport { 40000, 41641 } accept
		iif "wlan1" udp dport { 53, 67, 1900, 5351 } accept
		iif "wlan1" tcp dport 53 accept
		iif "tailscale0" accept
		ip protocol icmp accept
		ip6 nexthdr ipv6-icmp accept
	}

	chain forward {
		type filter hook forward priority filter; policy drop;
		ct state established,related accept
		jump forwardUPnP
		iif "wlan1" oif "eth0" accept
		iif "tailscale0" oif "wlan1" accept
		iif "wlan1" oif "tailscale0" accept
		iif "eth0" oif "wlan1" ct status dnat accept
		ip protocol icmp accept
	}

	chain output {
		type filter hook output priority filter; policy accept;
	}

	chain forwardUPnP {
		iif "eth0" th dport 41641 @nh,128,32 0xc0a832a7 @nh,72,8 0x11 accept
	}

	chain prerouting {
		type nat hook prerouting priority dstnat; policy accept;
		jump UPnP
	}

	chain postrouting {
		type nat hook postrouting priority srcnat; policy accept;
		jump UPnP_Postrouting
		oif "eth0" ip saddr 192.168.50.0/24 masquerade
		oif "tailscale0" ip saddr 192.168.50.0/24 masquerade
	}

	chain UPnP {
		iif "eth0" @nh,72,8 0x11 th dport 41643 dnat ip to 192.168.50.167:41641
	}

	chain UPnP_Postrouting {
	}
}
```
You can see that one of my client has already requested a UPnP rule, and is working.

## Benchmarking {#Benchmark}

<figure style="text-align:center;">
  <img src="/assets/2026-03-05-resources/3.avif" alt="Pi router" style="width:50%;max-width:440px;display:block;margin:0 auto;" />
</figure>
<div style="text-align:center; font-size:0.85rem;color:#64748b;margin-top:.4rem;">Right side is my router and left side is eduroam</div>

My WAN is using ethernet from my dorm, I know it is under 1000M but greater then 500M.
I tested the raw cable speed with my computer. And this WIFI 6 at 5GHz is running at the
maximum throughput of ethernet cable. WIFI 7 AP at 6GHz can not be achieved because 6.12 kernel has
not yet support 6GHz AP for this card. If later this year, raspberry pi os rolls out 6.18.y kernels,
I will try again with WIFI 7.

## Hardware selection guide {#Hardware}

Selecting hardware is important for a DIY router. In this tutorial I am using a Raspi 5 and mt7925 wifi card. Mt7925 raspi 5 requires custom kernel builds, more complicated overhead, but the price is cheap compare to a full feature WIFI 7 card. This card only partially support WIFI 7 160MHz.

If you need WIFI 7 as client, use Intel BE200 or AX210. You may want to check [Exploring WIFI 7 on a Raspberry pi 5 by Jeff Geerling released on Mar 14, 2025](https://www.jeffgeerling.com/blog/2025/exploring-wifi-7-2-gbps-on-raspberry-pi-5/)

For AP mode, choose a wifi card that support dual or tri band that can runs concurrently. Mt7925 only
support one band at a time, which means either 2.4GHz or 5GHz. 

`Mt7915` support dual band, 2.4 and 5 for WIFI 6. And
it is not a new card, linux kernel has support for it. [mt7915e driver fails to load on Raspberry Pi 5 with error -12](https://github.com/raspberrypi/linux/issues/7026), driver may have some issues, custom
build kernel could solve. Actually `mt7925e` for mt7925, without custom build kernel, exit code 12 is observed as well.

`QCM865` is a wide recommended card by community as well, which provides full speed of WIFI 7.
But a custom build kernel might still be needed. [ath11k PCI WIFI 6 card not detected](https://forums.raspberrypi.com/viewtopic.php?t=396484). `ath11k` driver is used by `QCM865` as well, not shipped by
standard raspberry pi os kernel.

