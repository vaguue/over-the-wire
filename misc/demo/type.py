import fcntl
import os
import pty
import re
import select
import struct
import sys
import termios
import time

COLUMNS = 100
ROWS = 32
SHELL_PROMPT = b'# '
OTW_PROMPT = b'> '
KEY_DELAY = 0.045
BEFORE_ENTER = 0.5
AFTER_ANSWER = 1.4
ANSWER_TIMEOUT = 20

SESSION = [
    (SHELL_PROMPT, 'otw'),
    (OTW_PROMPT, "p = wire.p.ipv4({ dst: 'github.com' }).icmp()"),
    (OTW_PROMPT, 'r = wire.s(p).ex()'),
    (OTW_PROMPT, 'r.ipv4.src'),
    (OTW_PROMPT, 'r.icmp.typeName'),
    (OTW_PROMPT, "syn = wire.p.ipv4({ dst: 'github.com' }).tcp({ src: 40123, dst: tcp.PORT_HTTPS, flags: { syn: 1 } })"),
    (OTW_PROMPT, 'wire.s(syn).ex()'),
    (OTW_PROMPT, '_.tcp.flags'),
    (OTW_PROMPT, 'wire.f.icmp({ type: icmp.ECHO_REPLY })'),
    (OTW_PROMPT, '.exit'),
]


CONTROL_SEQUENCE = re.compile(rb'\x1b\[[0-9;?]*[A-Za-z]')


def ends_with_prompt(seen, prompt):
    return CONTROL_SEQUENCE.sub(b'', seen).rstrip(b' ').endswith(prompt.rstrip(b' '))


def relay(terminal, until=None, quiet=0.3):
    seen = b''
    deadline = time.time() + ANSWER_TIMEOUT

    while time.time() < deadline:
        readable, _, _ = select.select([terminal], [], [], quiet)

        if not readable:
            if until is None or ends_with_prompt(seen, until):
                return
            continue

        try:
            chunk = os.read(terminal, 4096)
        except OSError:
            return

        if not chunk:
            return

        os.write(sys.stdout.fileno(), chunk)
        seen += chunk


def type_line(terminal, line):
    for key in line:
        os.write(terminal, key.encode())
        relay(terminal, quiet=KEY_DELAY)

    time.sleep(BEFORE_ENTER)
    os.write(terminal, b'\r')


def main():
    child, terminal = pty.fork()

    if child == 0:
        os.environ['PS1'] = SHELL_PROMPT.decode()
        os.execvp('sh', ['sh'])

    fcntl.ioctl(terminal, termios.TIOCSWINSZ, struct.pack('HHHH', ROWS, COLUMNS, 0, 0))

    for prompt, line in SESSION:
        relay(terminal, until=prompt)
        time.sleep(AFTER_ANSWER)
        type_line(terminal, line)

    relay(terminal, until=SHELL_PROMPT)
    time.sleep(AFTER_ANSWER)
    os.write(terminal, b'exit\r')
    relay(terminal)


main()
