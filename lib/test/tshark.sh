#!/bin/bash


tshark -r example1.pcap -T json | jq | less -r
