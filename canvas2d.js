function start() {
    
    var arrow   = document.getElementById("arrow");
    var target  = document.getElementById("target");

    var ctxs    = [document.getElementById("canvas1").getContext("2d"), 
                    document.getElementById("canvas2").getContext("2d")];   

    var ctxIndex = 0;               

    var drawer = draw(ctxs[ctxIndex], arrow, target);

    setInterval(() => {

        //var start = Date.now();

        if(drawer.next().done) {

            ctxIndex = (ctxIndex + 1) % ctxs.length;
            drawer = draw(ctxs[ctxIndex], arrow, target);
        }

        //console.log(Date.now() - start);

    }, 25);
}

function* draw(ctx, img, target)
{
    var start = Date.now()

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var row = 0;
    var col = 0;

    for(var i = 0; i < 20000 ; i++) {

        ctx.drawImage(img, col, row);

        col += 6;

        if(col > ctx.canvas.width) {

            col = 0;
            row = row + 6;
        }

        if (i > 0 && i % 500 == 0) {

            yield;
        }
    }

    target.src = ctx.canvas.toDataURL();
}   