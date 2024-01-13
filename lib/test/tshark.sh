#!/bin/bash

[ -z "$1" ] && src="exampl1.pcap" || src=$1

tshark -r $src -T json | jq | less -r
