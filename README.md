coreutils.js
============

Basic command line utilities, the Javascript way


This project is an implementation of the
[GNU Coreutils](http://www.gnu.org/software/coreutils) commands in Javascript,
adding an object-oriented design and some Node.js
[stream](http://nodejs.org/api/stream.html) features while we were there :-)

This project has got inspiration and ~~stolen~~ borrowed code fragments from
[shelljs](https://github.com/arturadib/shelljs) and
[bashful](https://github.com/substack/bashful) projects, and has implemented
some ideas from [TermKit](http://acko.net/blog/on-termkit).


Commands
--------

### textutils
- [x] **cat** needs show-nonprinting
- [ ] cksum
- [ ] comm
- [ ] csplit
- [ ] cut
- [ ] expand
- [ ] fmt
- [ ] fold
- [ ] head
- [ ] join
- [ ] md5sum
- [ ] nl
- [ ] od
- [ ] paste
- [ ] pr
- [ ] ptx
- [ ] sha1sum
- [x] sort
- [ ] split
- [ ] sum
- [ ] tac
- [ ] tail
- [ ] tr
- [ ] unexpand
- [ ] uniq
- [ ] wc

### fileutils
- [ ] chgrp
- [ ] chmod
- [ ] chown
- [ ] cp
- [ ] dd
- [ ] df
- [ ] dir
- [ ] dircolors
- [ ] du
- [ ] install
- [ ] ln
- [x] ls
- [ ] mkdir
- [ ] ~~mkfifo~~
- [ ] ~~mknod~~
- [ ] mv
- [ ] rm
- [ ] rmdir
- [ ] sync
- [ ] touch
- [ ] vdir

### sh utils
- [ ] basename
- [ ] chroot
- [x] **date** needs arguments
- [ ] dirname
- [x] **echo** needs escape of backslash
- [ ] ~~env~~
- [ ] expr
- [ ] groups
- [ ] hostname
- [ ] id
- [ ] logname
- [ ] pathchk
- [ ] printenv
- [ ] printf
- [ ] sleep
- [x] tee
- [ ] test
- [ ] ~~tty~~
- [ ] ~~users~~
- [ ] ~~who~~
- [ ] ~~whoami~~
- [ ] yes
- [ ] ~~nice~~
- [ ] nohup
- [ ] ~~su~~
- [ ] ~~stty~~
- [ ] uname

### [Posix](http://pubs.opengroup.org/onlinepubs/009604599/utilities/xcu_chap02.html#tag_02_09_01_01)
- [ ] alias
- [ ] bg
- [x] **cd** needs arguments
- [ ] command
- [ ] false
- [ ] fc
- [ ] fg
- [ ] getopts
- [ ] jobs
- [ ] kill
- [ ] newgrp
- [x] pwd
- [ ] read
- [ ] true
- [ ] umask
- [ ] unalias
- [ ] wait

### extras
- [x] **grep** needs arguments
