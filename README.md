coreutils.js
============

Basic command line utilities, the Javascript way


This project is an implementation of the
[GNU Coreutils](http://www.gnu.org/software/coreutils/) commands in Javascript,
adding an object-oriented design and some Node.js
[stream](http://nodejs.org/api/stream.html) features while we were there :-)

This project has got inspiration and ~~stolen~~ borrowed code fragments from
[shelljs](https://github.com/arturadib/shelljs) and
[bashful](https://github.com/substack/bashful) projects, and has implemented
some ideas from [TermKit](http://acko.net/blog/on-termkit/).


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
- [ ] sort
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
- [ ] false
- [ ] groups
- [ ] hostname
- [ ] id
- [ ] logname
- [ ] pathchk
- [ ] printenv
- [ ] printf
- [x] pwd
- [ ] sleep
- [ ] tee
- [ ] test
- [ ] true
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

### extras
- [x] **cd** needs arguments
- [x] **grep** needs arguments
