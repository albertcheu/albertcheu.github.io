---
layout: post
title:  "Another approach"
date:   2016-07-05 10:57:41
categories: jekyll update
---

Information theory can be used to think about complexity in interesting ways.[^1]

### The class NP

Suppose Alice wants to convince Bob of $$x$$, "Beauty is in the eye of the beholder." She is using a noisy channel.

The best way to achieve her goal would be to use a story (i.e. the Twilight Zone episode "The Eye of the Beholder").

Bob should be able to reconstruct the narrative. Why? Because 1) names appear multiple times 2) sentences & paragraphs obey certain internal structures 3) sentences & paragraphs causally follow from previous sentences & paragraphs.[^2]

If Alice gives Bob the string $$y$$ "The number n=73 is prime", Bob will have to mull on it a bit to be convinced. It will take longer with larger $$n$$ and even longer with more complicated statements ("Ramsey of 5 is 43").

The proof of $$y$$ is like an encoder. Even if a step or two are missing, Bob can "get the message" by virtue of how proofs are structured.

The "NP channel" has capacity "poly," meaning you need polynomial number of bits to ensure the reader is convinced of your statement.

### NP-hardness

The notion that $$P\neq NP$$ is probably an information theoretic claim. The source coding theorem puts a limit on how much you can compress a piece of data; something similar should hold for the minimum search space. There's a super-polynomial lower bound on the number of computational steps that can support all NP problems.

[^1]: This post overhauled on 7/10/16. Edited again 11/12/16.

[^2]: Stories---fables, legends, religious texts---are a way for truths to be preserved through the noisy channel that is time.