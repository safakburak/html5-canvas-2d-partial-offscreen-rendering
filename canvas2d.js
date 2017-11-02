
function start() {
    
    var mousePositions = [];

    var arrow   = document.getElementById("arrow");
    var target  = document.getElementById("target");

    var ctxs    = [document.getElementById("canvas1").getContext("2d"), 
                    document.getElementById("canvas2").getContext("2d")];   

    var ctxIndex = 0;               

    var drawer = draw(ctxs[ctxIndex], arrow, target, mousePositions);       // start with first canvas as back buffer

    var totalTime = 0;
    var totalSamples = 0;


    setInterval(() => {

        var start = Date.now();

        if(drawer.next().done) {                            // draw until completed

            ctxIndex = (ctxIndex + 1) % ctxs.length;        // move to the next canvas
            drawer = draw(ctxs[ctxIndex], arrow, target, mousePositions);   // set the new canvas as the back buffer
        }

        totalTime += (Date.now() - start);
        totalSamples++;

        if(totalSamples > 0 && totalSamples % 100 == 0)
        {
            console.log(`${totalSamples} draw calls made. Average rendering time per part so far: ${totalTime / totalSamples} ms.`);
        }

    }, 25);

    target.addEventListener("mousemove", (e) => {

        if(window.event.ctrlKey) {

            mousePositions.push({x: e.x, y: e.y});
        }
    });
}

function* draw(ctx, img, target, mousePositions)
{
    var start = Date.now()

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for(var i = 0; i < mousePositions.length; i++) {       // 20000 images will be drawn

        var p = mousePositions[i];

        if(i > 0) {
            
            var prev =  mousePositions[i - 1];

            ctx.translate(p.x, p.y);
            ctx.rotate(Math.atan2(prev.y - p.y, prev.x - p.x) + Math.PI);
            ctx.translate(-p.x, -p.y);
        }

        ctx.drawImage(img, p.x - img.width / 2,  p.y - img.height / 2);

        if(i > 0) {
            
            ctx.resetTransform();
        }

        if (i > 0 && i % 1000 == 0) {       // 1000 images per iteration

            yield;
        }
    }

    target.src = ctx.canvas.toDataURL();    // Set the current canvas as the front buffer
}   