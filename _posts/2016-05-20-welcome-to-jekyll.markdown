---
layout: post
title:  "Welcome to Hyde"
date:   2016-05-20 3:58:34 -0400
categories: jekyll update
---
Getting this Jekyll blog up and running was mildly traumatizing.

1. *Ruby 2.X*: apparently, the apt-get version is 1.9; I did not realize this until jekyll failed to install. I had to search for a installer that had the latest versions.

   I chose ruby-install, which isn't horrible but a) I shouldn't install something to install something else, b) installing it took a while, c) using it took even longer.

2. *PATH setup*: the worst part of ruby-install, and probably other such tools, is that it doesn't put Ruby & its gems in /usr/local/bin or /usr/bin/ by default. Instead, the code winds up in your home directory...in a hidden directory.

    Now, I can imagine the reasons for this, but there should be at least a heads-up (along the lines of "installing in \<wherever\>; proceed? [Y/n]: ")

3. *Javascript runtime*: Attempting to run jekyll at this point yields another error: jekyll needs another tool to run javascript. To resolve the issue, I had to run 'sudo apt-get install nodejs'.

   Again, the simplest solution would be to give a prompt; in this case, a selection of runtimes would be really helpful.

Bizarre machinery like this is one of the many reasons I'm wary of big software projects.
