function shuffle(idParentToShuffle) {
  document.addEventListener("DOMContentLoaded", function(){
      var parent = document.getElementById(idParentToShuffle);
      if(parent != null && parent != undefined){
        for (var i = parent.children.length; i >= 0; i--) {
            parent.appendChild(parent.children[Math.random() * i | 0]);
        }
      }
  });
}
