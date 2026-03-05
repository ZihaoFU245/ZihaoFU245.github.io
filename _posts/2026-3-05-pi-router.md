---
layout: single
title: "DIY Raspberry pi router tutorial"
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

### Hardware List

- Raspberry pi 5 8Gb
- mt7925 MediaTek wifi card or any wifi card you have
- A Raspberry pi HAT: PCIe to M.2 Key E
- 2 antennas

Assemble the hardware before you continue.

## 1. Check wifi card compatibility

My wifi card mt7925 is not fully supported on raspberry pi OS with kernel 6.12.y. I plugged it in,
and wifi interface did not show up. I could only rebuild the kernel myself. Below is
how you would build it.

> If your wifi card is supported, you can find it in `ip addr`, skip this step.

If you are using Intel cards, like BE200 and AX210 they are likely supported. You would
find the interface, usually called `wlan1` in `ip a` command. However, intel cards are
good for client mode, AP mode is not good as MediaTek.

####

