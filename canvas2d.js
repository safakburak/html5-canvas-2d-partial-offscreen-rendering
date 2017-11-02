function start() {
    
    var arrow   = document.getElementById("arrow");
    var target  = document.getElementById("target");

    var ctxs    = [document.getElementById("canvas1").getContext("2d"), 
                    document.getElementById("canvas2").getContext("2d")];   

    var ctxIndex = 0;               

    var drawer = draw(ctxs[ctxIndex], arrow, target);       // start with first canvas as back buffer

    var totalTime = 0;
    var totalSamples = 0;

    setInterval(() => {

        var start = Date.now();

        if(drawer.next().done) {                            // draw until completed

            ctxIndex = (ctxIndex + 1) % ctxs.length;        // move to the next canvas
            drawer = draw(ctxs[ctxIndex], arrow, target);   // set the new canvas as the back buffer
        }

        totalTime += (Date.now() - start);
        totalSamples++;

        if(totalSamples > 0 && totalSamples % 100 == 0)
        {
            console.log(`${totalSamples} draw calls made. Average rendering time per part so far: ${totalTime / totalSamples} ms.`);
        }

    }, 25);
}

function* draw(ctx, img, target)
{
    var start = Date.now()

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var row = 0;
    var col = 0;

    for(var i = 0; i < 20000 ; i++) {       // 20000 images will be drawn

        ctx.drawImage(img, col, row);

        col += 6;

        if(col > ctx.canvas.width) {

            col = 0;
            row = row + 6;
        }

        if (i > 0 && i % 1000 == 0) {       // 1000 images per iteration

            yield;
        }
    }

    target.src = ctx.canvas.toDataURL();    // Set the current canvas as the front buffer
}   