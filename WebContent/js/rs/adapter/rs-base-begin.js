(function(){
	var libFlyweight;
	
	function fly(el) {
        if (!libFlyweight) {
            libFlyweight = new Rs.Element.Flyweight();
        }
        libFlyweight.dom = el;
        return libFlyweight;
    }
