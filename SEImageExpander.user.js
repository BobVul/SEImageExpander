// ==UserScript==
// @name          SEImageExpander
// @namespace     http://vulpin.com/
// @description	  Let people click on images to view the full size
// @match         *://*.askubuntu.com/*
// @match         *://*.mathoverflow.net/*
// @match         *://*.onstartups.com/*
// @match         *://*.serverfault.com/*
// @match         *://*.stackapps.com/*
// @match         *://*.stackexchange.com/*
// @match         *://*.stackoverflow.com/*
// @match         *://*.superuser.com/*
// @version       1.0.2
// @grant         none
// ==/UserScript==

(function() {
var Program = {
    main: function() {
        window.removeEventListener('load', mainEventListener, false);
        
        var observer = new MutationObserver(function(mutations, observer) {
            // y'know what? MutationObserver sucks.
            // it doesn't give every modified node, just the top of a tree of modified nodes
            mutations.forEach(function(mutation) {
                Array.prototype.forEach.call(mutation.addedNodes, Program.processImgDescendants);
            });
        });
        
        observer.observe(document, {
            subtree: true,
            childList: true
        });
        
        Program.processImgDescendants(document);
    },
    
    processImgDescendants: function(node) {
        var imgNodes = node.querySelectorAll('.post-text img');
        
        Array.prototype.forEach.call(imgNodes, function(imgNode) {
            Program.processNode(imgNode);
        });
    },
    
    processNode: function(node) {
        if (node.tagName.toUpperCase() !== 'IMG') {
            return;
        }
        
        // walk up the tree until we reach the main post div, we don't care what's beyond that
        var parent = node;
        while (!parent.classList.contains('post-text')) {
            // if this image is already within a link, don't touch it
            if (parent.tagName.toUpperCase() === 'A') {
                return;
            }
            
            parent = parent.parentNode;
            
            // have we made it all the way to the top? we're not in a post!
            if (parent === null) {
                return;
            }
        }
        
        // ok, now we know the node is an unlinked image within a post
        var link = document.createElement('a');
        link.href = node.src;
        link.target = '_blank';
        node.parentNode.replaceChild(link, node);
        link.appendChild(node);
    }
};

var mainEventListener = Program.main.bind(Program);

window.addEventListener('load', mainEventListener, false);
})();
