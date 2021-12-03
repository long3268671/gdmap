// import { ref,reactive } from "vue";
export default function (AMap,map,mouseTool,overlays) {
    // const mouseTool = reactive({
    //     type:'',
    //     mouseToolDraw:{}
    // });
    // const overlays = ref([])
    console.log(222222,overlays)
    mouseTool.type = '';
    mouseTool.mouseToolDraw = new AMap.MouseTool(map.value);
    mouseTool.mouseToolDraw.on('draw',(e)=>{
        console.log(e)
        // this.mouseTool.mouseToolDraw.close()
        overlays.push(e.obj);
        console.log(overlays)
    })
    const getMouseToolType =(type)=>{
        mouseTool.type = type;
        console.log('mouseTool.type',mouseTool.type);
        draw(type)
    }
    const draw = (type)=>{
        switch(type){
            case 'marker':{
                mouseTool.mouseToolDraw.marker({
                    //同Marker的Option设置
                });
                break;
            }
            case 'polyline':{
                mouseTool.mouseToolDraw.polyline({
                    strokeColor:'#80d8ff'
                    //同Polyline的Option设置
                });
                break;
            }
            case 'polygon':{
                mouseTool.mouseToolDraw.polygon({
                    fillColor:'#00b0ff',
                    strokeColor:'#80d8ff'
                    //同Polygon的Option设置
                });
                break;
            }
            case 'rectangle':{
                mouseTool.mouseToolDraw.rectangle({
                    fillColor:'#00b0ff',
                    strokeColor:'#80d8ff'
                    //同Polygon的Option设置
                });
                break;
            }
            case 'circle':{
                mouseTool.mouseToolDraw.circle({
                    fillColor:'#00b0ff',
                    strokeColor:'#80d8ff'
                    //同Circle的Option设置
                });
                break;
            }
        }
    }
    const mouseToolRemove = ()=>{
        map.value.remove(overlays)
        overlays = [];
    }
    const mouseToolStop = ()=>{
        mouseTool.mouseToolDraw.close();
        mouseTool.type = '';
    }
    return {
        mouseTool,
        overlays,
        getMouseToolType,
        draw,
        mouseToolRemove,
        mouseToolStop,
    }

}

