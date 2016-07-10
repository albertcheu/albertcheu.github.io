---
layout: post
title:  "Another approach"
date:   2016-07-05 10:57:41
categories: jekyll update
---

Information theory can be used to think about complexity in interesting ways.[^1]

### The class NP

Suppose Alice wants to convince Bob that "Beauty is in the eye of the beholder." She is using a noisy channel.

The best way to achieve her goal would be to use a story (i.e. the Twilight Zone episode "The Eye of the Beholder").

Bob should be able to reconstruct the narrative. Why? Because 1) names appear multiple times 2) sentences & paragraphs obey certain internal structures 3) sentences & paragraphs causally follow from previous sentences & paragraphs.[^2]

If Alice gives Bob the string "The number n=73 is prime", Bob will have to mull on it a bit to be convinced. It will take longer with larger $$n$$ and even longer with more complicated statements ("Ramsey of 5 is 43").

Instead of a story-as-encoder, she relies on a proof-as-encoder. Even if a step or two are missing, Bob can figure out why the statement is or isn't true by virtue of how proofs are structured. Ideally, it's not too long; if the problem statement is in NP, it's of decent size.

The "NP channel" has capacity "poly" but it would be cool to know why this is the case.

### NP-hardness

Any NP problem can be reduced to any NP-hard problem, you just need a P-time transducer. Machines for NP-hard problems therefore implicity "contain," in a fashion, solutions for all NP problems. 

An NP-complete problem is an NP-hard problem that is also in NP: solvable in polynomial time by a nondeterministic Turing machine (NDTM).

So we're able to solve all the problems in NP with cleverly chosen P-time transducers and a special NP problem.

The notion that $$P\neq NP$$ is probably an information theoretic claim. The source coding theorem puts a limit on how much you can compress a piece of data; something similar should hold for the minimum search space. Instead of bits, there's a lower bound on the number of computational steps that still support all NP problems.

[^1]: This post overhauled on 7/10.

[^2]: Stories---fables, legends, religious texts---are a way for truths to be preserved through the noisy channel that is time.