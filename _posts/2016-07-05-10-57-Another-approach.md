---
layout: post
title:  "Another approach"
date:   2016-07-05 10:57:41
categories: jekyll update
---

Any NP problem can be reduced to any NP-hard problem, you just need a P-time transducer. Machines for NP-hard problems therefore implicity "contain," in a fashion, solutions for all NP problems. 

An NP-complete problem is an NP-hard problem that is also in NP: solvable in polynomial time by a nondeterministic Turing machine (NDTM).

So we're able to solve all the problems in NP with cleverly chosen P-time transducers and a special NP problem.

The conjecture that $$P=NP$$ means you can compress the search space of NPC problems to the point where a poly-time deterministic machine can decide it. In other words, the new machine must still be able to solve all NP problems using the same transducer.

---

Shannon's limit: there's an upper bound on how much you can send through a channel without significant loss.

Observations:

* An algorithm that decides a language with a low probability of failure resembles a noisy channel and vice versa.

* In information theory, we look at data rate; in computational complexity theory, we look at running time.

Conjecture: Something like the Shannon limit exists for Turing Machines.

* Think of an NDTM or TM as a channel. Given the IS-ODD channel, Alice can send bits to Bob by sending numbers through knowing that only the last bit will be received.

* Impose a limit on our channels: they must give output to Bob in polynomial time (they are in NP)

* Alice has an arbitrary NP-decidable language (a bag of strings) and its complement. Once using a string, she cannot recycle it. But she can encode it (perform reduction)

* $$P\neq NP$$ means there is no reliable deterministic channel satisfying our time constraint for which there exists an encoder for Alice's strings (i.e. $$NPH\cap P = \emptyset$$).