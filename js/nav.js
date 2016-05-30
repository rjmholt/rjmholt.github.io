// Nasty hack to normalise the nav links without absolute paths
// in case there is no webserver
function getPathToRoot() {
    var path;
    switch (location.protocol) {
    // If we're using http, the webserver will handle paths nicely
    case 'http:':
        path = '/';
        break;
    // file protocol is useless, so paths need fixing up
    case 'file:':
        var pathSplit = location.pathname.split('/');
        var relDepth = (pathSplit.length-1) - (pathSplit.indexOf('website')+1);
        path = (relDepth > 0) ? '../'.repeat(relDepth) : '';
        break;
    }
    return path;
}

// Generate the nav element for a page given the path to the webroot
function generateNav(rootPath) {
    // Sanitise rootPath
    if (rootPath === undefined || rootPath === null) {
        rootPath = '';
    }

    // Can no longer import an HTML as the relative rootPath must be
    // injected into the nav html
    var navStr =
        '<nav>' +
        '<ul>' +
        '<li class="index"><a href="' + rootPath + 'index.html">Index</a></li>' +
        '<li class="aboutMe"><a href="' + rootPath + 'aboutMe.html">About Me</a></li>' +
        '<li class="contact"><a href="' + rootPath + 'contact.html">Contact</a></li>' +
        '<li class="posts"><a href="' + rootPath + 'posts.html">Posts</a></li>' +
        '</ul>' +
        '</nav>';

    return navStr;
}

// Generate a nav and add it to the page
function initNav() {
    var rootPath = getPathToRoot();
    var navStr = generateNav(rootPath);
    
    $('#navMenu').html(navStr);
}

// No document ready here:
// The nav is supposed to be part of the document,
// so load it as soon as possible
initNav();
