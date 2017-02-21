---
layout: page
title: About
permalink: /about/
---

I'm Rob Holt, a software engineer with an interest in programming languages,
distributed systems and functional programming. Welcome to my site!

If you'd like to get in touch with me, execute any of the following programs
to get my contact details.

#### Haskell

{% highlight haskell %}
import Data.Char
import Data.Bits

o = 0x49
b = [59,81,60,84,59,87,35,99,4,105,8,97,13,35,64,47,66]

r _ []     = []
r k (c:cs) = 
  let v = k `xor` c in
  (chr v) : r (k `xor` v) cs

main = print $ r o b
{% endhighlight %}

#### Python 3

{% highlight python %}
from base64 import b64decode

x = b64decode(b'O1E8VDtXI2MEaQhhDSNAL0I=')
k = 0x49
a = []
for b in x:
  r = b ^ k
  a.append(r)
  k ^= r

print(bytes(a).decode('utf-8'))
{% endhighlight %}

<!--
This is the base Jekyll theme. You can find out more info about customizing your Jekyll theme, as well as basic Jekyll usage documentation at [jekyllrb.com](http://jekyllrb.com/)

You can find the source code for the Jekyll new theme at:
{% include icon-github.html username="jekyll" %} /
[minima](https://github.com/jekyll/minima)

You can find the source code for Jekyll at
{% include icon-github.html username="jekyll" %} /
[jekyll](https://github.com/jekyll/jekyll)
-->
