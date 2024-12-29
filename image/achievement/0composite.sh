#!/bin/bash

function b() {
    convert ../$1.png -resize 32x32 -background black -shadow 50x1+10+10 1.png
    convert ../$1.png -resize 32x32 2.png
    convert achievement$2.png 1.png -geometry 32x32+36+32 -composite 3.png
    convert 3.png 2.png -geometry 26x26+39+35 -composite 0.png
    convert 0.png -depth 24 -define png:compression-filter=1 -define png:compression-level=9 -define png:compression-strategy=2 $1"_"$2.png
}

function a() {
    b $1 1
    b $1 2
    b $1 3
}

a black
a blue
a brown
a cyan
a gray
a green
a lime
a mountains
a orange
a pink
a purple
a red
a time
a balloons
a white
a yellow

rm 0.png 1.png 2.png 3.png