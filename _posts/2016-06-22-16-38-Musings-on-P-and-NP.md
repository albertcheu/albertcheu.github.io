---
layout: post
title:  "Musings on P and NP"
date:   2016-06-22 16:38:41
categories: jekyll update
---
It is a conjecture universally acknowledged that $$P\neq NP$$.

Now, there's something profound about that supposition: no matter how hard you try, no matter what byzantine construction or reduction you discover, no matter how much space you use, you will never create an algorithm to solve, say, the Hamiltonian path problem $$HPP$$ in polynomial time.

This is a tradeoff that isn't worth it; the entire field of approximation is basically a sad but necessary coping mechanism.

---

Being a visually-oriented person, I enjoy a good graph; just like we can illustrate the balancing-act between pressure and volume of an ideal gas at constant temperature[^1], let's illustrate this complexity tradeoff for decision problem $$p$$.

On the horizontal axis, how do we measure "effort" put into an algorithm? Let's adapt Kolmogorov complexity: define machine complexity $$m$$ as the smallest number of bits necessary to represent the algorithm and the proof of its correctness[^2].

We put Big-Oh running time on the vertical axis $$t$$. Of course there's no way to order the totality of non-decreasing functions; we will only sample a countable subset.

Because we want to focus on the "best" algorithms, let $$\varepsilon_t(m,p)$$ be the quickest running time of $$m$$-bit machines that decide $$p$$. So what we're doing is allowing more bits for an algorithm designer to use and seeing how fast the result is. As there are countably many values for $$m$$, we will obtain countably many running times.

If $$P\neq NP$$, then the function for $$HPP$$ will level off above polynomial time. We *see* the optimal asymptotic running time as an asymptote.

I think it's a pretty picture. It might even be useful.

---

Look at the leftmost point (corresponding to the algorithm of minimal size). Possibly totally wrong conjecture: it is polynomial time iff $$p\in P$$. This means the $$\varepsilon_t(m,p)$$ function never crosses the division between polynomial and super-polynomial time.

Full disclosure: I'm sure these notions are a side effect of learning about Ramsey theory last summer (i.e. smallest program that solves $$p$$ is a Ramsey-type question).

---

[^1]:I took too many physics classes in college

[^2]:Not all true statements are provable, but is it useful to think about correct algorithms that cannot be proven correct?