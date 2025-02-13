#!/bin/sh

[ -z "$1" ] && src="data/exampl1.pcap" || src=$1

tshark -r $src -T json | jq | less -r
