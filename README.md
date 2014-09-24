coreutils.js
============

Basic command line utilities, the Javascript way


This project is an implementation of the [GNU Coreutils](http://www.gnu.org/software/coreutils/)
commands in Javascript, adding some [Node.js](http://nodejs.org/)
object-oriented features while we were there :-)

This project has got inspiration and ~~stolen~~ borrowed code fragments from
[shelljs](https://github.com/arturadib/shelljs) and
[bashful](https://github.com/substack/bashful) projects.


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
- [ ] ginstall
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
- [x] grep
