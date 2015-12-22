coreutils.js
============
Basic command line utilities, the Node.js way

This project is an implementation of the
[GNU Coreutils](http://www.gnu.org/software/coreutils) commands in Javascript,
adding an object-oriented design and some Node.js
[stream](http://nodejs.org/api/stream.html) features while we were there :-)


This project has got inspiration and ~~stolen~~ borrowed code fragments from
[shelljs](https://github.com/arturadib/shelljs) and
[bashful](https://github.com/substack/bashful) projects, and has implemented
some ideas from [TermKit](http://acko.net/blog/on-termkit). The main
characteristic diferences from GNU Coreutils are

* **objects, not text**: standard coreutils are independent programs where the
only one interface with the exterior world are character streams derived from
the usage on a terminal, so this text needs to be parsed each time between
commands. Coreutils.js is designed as a library of functions, so high-level
objects can be passed between them, and each one of them implement an `inspect`
method to be used when printing their content on a terminal to show their usual
behaviour.
* **streams, not lists**: for commands that generates a list of values,
Coreutils.js return a Stream object instead of an Array (split data in time
instead of space) since they are easily convertible between them and has a
better performance and offers more flexibility for big data sets, reason why the
Streams API is the standard interface in Node.js modules allowing them to be
connected to others. Also each returned stream has an added `type` attribute to
show the type of their contents and help to process them later.

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
- [x] **head** needs implement bytes counting
- [ ] join
- [ ] md5sum
- [ ] nl
- [ ] od
- [ ] paste
- [ ] pr
- [ ] ptx
- [ ] sha1sum
- [x] **sort**
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
- [x] **dir**
- [ ] dircolors
- [ ] du
- [ ] install
- [ ] ln
- [x] **ls**
- [ ] mkdir
- [ ] ~~mkfifo~~
- [ ] ~~mknod~~
- [ ] mv
- [ ] rm
- [ ] rmdir
- [ ] ~~sync~~
- [ ] touch
- [ ] vdir

### sh utils
- [ ] basename
- [x] chroot
- [x] **date** needs arguments
- [x] **dirname**
- [x] **echo** needs escape of backslash
- [x] env
- [ ] expr
- [ ] groups
- [x] hostname
- [ ] id
- [ ] logname
- [ ] pathchk
- [ ] printenv
- [ ] printf
- [x] sleep
- [x] **tee**
- [x] **test** needs *fd open on terminal* and inline operators
- [ ] ~~tty~~
- [ ] ~~users~~
- [ ] ~~who~~
- [ ] ~~whoami~~
- [x] **yes**
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
- [ ] ~~false~~
- [ ] fc
- [ ] fg
- [ ] getopts
- [ ] jobs
- [ ] kill
- [ ] newgrp
- [x] **pwd**
- [ ] read
- [ ] ~~true~~
- [x] umask
- [ ] unalias
- [ ] wait

### extras
- [ ] free
- [x] **grep** needs arguments
- [ ] shasum
- [ ] sha256sum
- [ ] uptime
