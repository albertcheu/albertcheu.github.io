---
layout: post
title:  "My first Chrome Extension"
date:   2016-05-22 20:03:34
categories: jekyll update
visible: 0
---

Working with Chrome isn't awful at all. The documentation is nice and the programmer has access to sufficiently many features.

The only "problem," if I can call it that, are security limitations. When the user holds CTRL, my extension changes the tab's title (the document's title, precisely) to the tab index. It makes jumping between tabs very easy: CTRL+i natively sends you to the ith tab. There is neither clicking nor button spamming.

However, the extension isn't activated until the GUI icon is clicked. Which sort of defeats the purpose of avoiding clicks.

But the alternative would be to have extensions that run on their own, which is very unsafe.

It's entirely possible my implementation is broken in some fashion and you can in fact decouple icon-clicking and event handling.