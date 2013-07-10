define append_if_no_matching_line($match, $append, $file=$name) {
    $xfile = shellquote($file)
    $xappend = shellquote($append)
    $xmatch = shellquote($match)
    exec { "/bin/echo $xappend >> $xfile":
        unless => "/bin/grep -E $xmatch $xfile",
        logoutput => on_failure,
    }
}
