#!/usr/bin/python
import sys
from datetime import datetime
#date:   2016-05-20 3:58:34 -0400

frontmatter = """---
layout: post
title:  "{}"
date:   {}
categories: jekyll update
visible: 1
---
"""

title = " ".join(sys.argv[1:])
now = datetime.now()
date = "{:%Y-%m-%d %H:%M:%S}".format(now)
output = frontmatter.format(title,date)

date = "{:%Y-%m-%d-%H-%M}".format(now)
title = "-".join(sys.argv[1:])
f = open(date+"-"+title+".md",'w')
f.write(output)
f.close()
