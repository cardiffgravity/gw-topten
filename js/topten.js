var obsruns={
    'O1':{'start':new Date('2015-09-12T00:00:00'),'end':new Date('2016-01-19T16:00:00')},
    'O2':{'start':new Date('2016-11-30T16:00:00'),'end':new Date('2017-08-25T22:00:00')},
    'O3a':{'start':new Date('2019-04-01T00:00:00'),'end':new Date('2019-10-01T17:00:00')},
    'O3b':{'start':new Date('2019-11-01T15:00:00'),'end':new Date('2020-03-27T17:00:00')}
}
function makeTopTen(){
    // make top ten database
    this.t10=new TopTen();
    if ((gwcat.meta)&&(gwcat.meta.GWTC)){
        document.getElementById('gwtc-build-date').innerHTML = gwcat.meta.GWTC.retrieved
        document.getElementById('gwtc-build-url').setAttribute('href',gwcat.meta.GWTC.src)
    }
    if ((gwcat.meta)&&(gwcat.meta.graceDB)){
        document.getElementById('gracedb-build-date').innerHTML = gwcat.meta.graceDB.retrieved
        document.getElementById('gracedb-build-url').setAttribute('href',gwcat.meta.graceDB.src)
    }
    return this;
}
var em2px=16;
var px2em=1/em2px;

function TopTen(){
    this.getUrlVars();
    this.init();
    // this.init();
    return this;
}
TopTen.prototype.init = function(holderid='top10holder'){
    var _t10=this;
    this.hid=holderid;
    this.lid='list-holder';
    this.defaults={listName:'mfinal',N:10,incCand:true,debug:false};
    this.listName = (this.urlVars.hasOwnProperty('listName'))?this.urlVars.listName:this.defaults.listName;
    this.N = (this.urlVars.hasOwnProperty('N'))?this.urlVars.N:this.defaults.N;
    this.incCand = (this.urlVars.hasOwnProperty('incCand'))?this.urlVars.incCand:this.defaults.incCand;
    // this.N=10;
    // this.incCand=true;
    // this.iconwid=1*em2px;
    this.iconwid=1;
    // add columns to data
    // addColumn('Delay',calcDelay,{sigfig:2,err:0,name_en:'Time waiting',unit_en:'Days'})
    // addColumn('Mratio',calcMratio,{sigfig:2,err:0,name_en:'Mass ratio'})
    // addColumn('Mtotal',calcMtotal,{'unit_en':'M_sun',sigfig:3,err:0,name_en:'Total mass'})
    // define lists
    this.lists={
        // 'totmass':{sortcol:'Mtotal',order:'dec',format:'',title:'Total Mass',icon:'img/mass.svg',icon_unit:10,show_err:true},
        'mfinal':{sortcol:'Mfinal',order:'dec',format:'',show_err:true,default:true,
            graph:{type:'icon',icon:'img/mass.svg',icon_unit:1,iconlabel:'1 M_sun'}},
        // 'mtotal':{sortcol:'Mtotal',order:'dec',format:'',show_err:true,default:true,
            // graph:{type:'icon',icon:'img/mass.svg',icon_unit:1,iconlabel:'1 M_sun'}},
        // 'loc':{sortcol:'deltaOmega',order:'asc',format:'',namelink:false,hoverlink:true,
        //     graph:{type:'bar',bar:'#000000',bar_min:1,bar_max:40000,bar_log:true}},
        'loc':{sortcol:'deltaOmega',order:'asc',format:'',namelink:false,hoverlink:true,
            graph:{type:'bar',bar:'#000000',bar_min:1,bar_max:40000,bar_log:true,scale:'loc'},
            infotype:"skyloc"},
        // 'delay':{sortcol:'Delay',valcol:'Delay',order:'asc',format:'',title:'Days waiting',
        //     graph:{type:'none'}},
        'mratio':{sortcol:'Mratio',order:'asc',format:'',title:'Mass Ratio',
            graph:{type:'bar',bar:'#000000',bar_min:0,bar_max:1,show_err:true,scale:'ratio'}},
        'distance':{sortcol:'DL',order:'asc',format:'',title:'Distance',show_err:true,
            graph:{type:'bar',bar:'#000000',bar_max:'auto',scale:'distance'}},
        'date':{sortcol:'GPS',valcol:'GPS',order:'asc',format:'date',title:'Detection Date',unit:'UTC',
            graph:{type:'bar',bar:'#000000',bar_min:1120000000,bar_max:1270000000,scale:'date',marker:true},infotype:'date'},
        // 'FAR':{sortcol:'FAR',order:'asc',format:'',sigfig:2,
        //     graph:{type:'iconfn',icon:imgFARfn,icon_fn:iconFARfn}},
        'Erad':{sortcol:'Erad',order:'dec',format:'',show_err:true,
            graph:{type:'icon',icon:'img/sun.svg',icon_unit:1,icon_size:2}},
        'Lpeak':{sortcol:'lpeak',order:'dec',format:'',show_err:true,
            graph:{type:'icon',icon:'img/bulb.svg',icon_unit:0.1}},
        'SNR':{sortcol:'rho',order:'dec',format:'',default:false,
            graph:{type:'bar',bar:'#ffffff',bar_img:'img/snrwave.svg',bar_min:0,bar_max:30,bar_height:'3em',scale:'SNR'}},
    };
    this.scales={
        distance:[{xfn:function(){return _t10.getBarMin()},lfn:function(){return (_t10.getBarMin()==0)?0:_t10.getBarMin()+' Mpc'}},
            {x:17,l:'Virgo Cluster'},
            {x:68,l:'Norma Cluster'},
            {x:100,l:'Coma Cluster'},
            {x:200,l:'Shapley Supercluster'},
            {x:600,l:'Caelum Supercluster'},
            // {x:750,l:'3C373'},
            {x:1100,l:'Bullet Cluster'},
            {x:3200,l:'Abell 732'},
            {xfn:function(){return _t10.getBarMax()},lfn:function(){return _t10.getBarMax()+' Mpc'}}
        ],
        loc:[{x:1,l:'1 deg<sup>2</sup>'},{x:2,l:''},{x:3,l:''},{x:4,l:''},{x:5,l:''},
            {x:6,l:''},{x:7,l:''},{x:8,l:''},{x:9,l:''},{x:10,l:'10 deg<sup>2</sup>'},
            {x:20,l:''},{x:30,l:''},{x:40,l:''},{x:50,l:''},
            {x:60,l:''},{x:70,l:''},{x:80,l:''},{x:90,l:''},{x:100,l:'100 deg<sup>2</sup>'},
            {x:200,l:''},{x:300,l:''},{x:400,l:''},{x:500,l:''},
            {x:600,l:''},{x:700,l:''},{x:800,l:''},{x:900,l:''},{x:1000,l:'1000 deg<sup>2</sup>'},
            {x:2000,l:''},{x:3000,l:''},{x:4000,l:''},{x:5000,l:''},
            {x:6000,l:''},{x:7000,l:''},{x:8000,l:''},{x:9000,l:''},{x:10000,l:'1000 deg<sup>2</sup>'},
            {x:20000,l:''},{x:30000,l:''},{x:40000,l:'40000 deg<sup>2</sup>'}
        ],
        ratio:[{x:0,l:0},
            {x:0.1,l:''},{x:0.2,l:''},{x:0.3,l:''},{x:0.4,l:''},{x:0.5,l:0.5},
            {x:0.6,l:''},{x:0.7,l:''},{x:0.8,l:''},{x:0.9,l:''},{x:1,l:1}
        ],
        SNR:[{xfn:function(){return _t10.getBarMin();},lfn:function(){return _t10.getBarMin();}},
            {x:0,l:0},{x:10,l:10},{x:20,l:20},{x:30,l:30},{x:40,l:40},
            {xfn:function(){return _t10.getBarMax();},lfn:function(){return _t10.getBarMax();}}
        ],
        date:[{x:1126051217,l:''},{x:1137254417,l:''},
            {x:1131652817,l:'O1',noline:true},
            {x:1164556817,l:''},{x:1187733618,l:''},
            {x:1176145217,l:'O2',noline:true},
            {x:1238112018,l:''},{x:1269363618,l:''},
            {x:1253737818,l:'O3',noline:true}
        ]
    }
    if (!this.lists[this.listName]){
        if (this.debug){console.log('Unknown list:',this.listName,'Using mfinal');}
        this.listName='mfinal'
    }
    this.buildSelector();
    this.buildKey();
    this.makeDiv();
    this.colsCheck();
    this.setList(this.listName);
    
    var nList=document.getElementById('nSelect');
    nList.onchange = function(){
        // console.log(this,this.value)
        _t10.N=this.value;
        _t10.setList(_t10.listName);
    }
    var candList=document.getElementById('candSelect');
    candList.onchange = function(){
        if (this.debug){console.log('select candidate',this,this.value)}
        _t10.incCand=(this.value=='yes')?true:false;
        // console.log(_t10.incCand);
        _t10.setList(_t10.listName);
    }
    window.addEventListener("resize",function(){
        _t10.setList(_t10.listName)
    });
}
TopTen.prototype.colsCheck = function(){
    var colscheck={
        'Mfinal':{'limit':'upper','alt':'Mtotal'},
        'Erad':{'limit':'lower'},
        'lpeak':{'limit':'lower'}
    };
    for (col in colscheck){
        for (n in gwcat.data){
            d=gwcat.data[n];
            if (d[col]){
                if (!d[col].hasOwnProperty('err')&&d[col].hasOwnProperty('best')){
                    if (this.debug){console.log('replacing',col,'for',d.name,':',d[col])}
                    d[col][colscheck[col].limit]=d[col].best;
                    delete d[col].best;
                    if (this.debug){console.log('replaced with:',d[col])}
                }
            }else if (d[colscheck[col].alt]){
                if (this.debug){console.log('creating',col,'for',d.name)}
                d[col]={approx:true};
                d[col][colscheck[col]['limit']]=d[colscheck[col].alt].best;
                if (this.debug){console.log('replaced with:',d[col])}
            }
        }
    }
}

TopTen.prototype.getUrlVars = function(){
    // Get URL and query variables
    var vars = {},hash;
    var url = window.location.href;
    if (window.location.href.indexOf('?')!=-1){
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        url = window.location.href.slice(0,window.location.href.indexOf('?'));
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars[hash[0]] = hash[1];
        }
    }
    // console.log("input:",vars);
    this.urlVars = vars;
    this.url = url;
    this.debug = (this.urlVars.debug) ? true : false;
    if(this.debug){console.log('debug',this.debug)}
}
TopTen.prototype.makeUrl = function(){
    var newUrl=this.url+'?';
    for (k in this.defaults){
        if (this[k]!=this.defaults[k]){
            newUrl+=k+'='+this[k]+'&';
        }
    }
    newUrl=newUrl.slice(0,newUrl.length-1);
    // console.log(newUrl);
    return(newUrl);
}
TopTen.prototype.buildSelector = function(holderid='selectorholder'){
    var _t10=this;
    sd=d3.select((holderid[0]=='#')?holderid:'#'+holderid);
    for (l in this.lists){
        sid="selector-"+l;
        var listitem=this.lists[l];
        if (listitem.title){
            title=listitem.title;
        }else{
            title=gwcat.paramName((listitem.valcol)?listitem.valcol:listitem.sortcol);
        }
        order=(listitem.order=='asc')?'&uarr;':'&darr;';
        sd.append('div')
            .attr('class','selector')
            .attr('id',sid)
        d3.select('#'+sid).append('div')
            .attr('class','selectorder')
            .attr('id','selorder-'+l)
            .html(order)
        d3.select('#selorder-'+l).on("click",function(){
            thisl=this.id.replace('selorder-','')
            _t10.reorderList(thisl);
        })
        d3.select('#'+sid).append('div')
            .attr('class','select')
            .attr('id','select-'+l)
            .html(title)
        // d3.select('#selector-'+l).on("click",function(){
        //     sellist=this.id.replace('selector-','');
        //     _t10.setList(sellist);
        // })
        d3.select('#'+sid).append('div')
            .attr('class','selectlink')
            .attr('id','selectlink-'+l)
        d3.select('#selectlink-'+l).on("click",function(){
            sellist=this.id.replace('selectlink-','');
            _t10.setList(sellist);
        })
    }
}
TopTen.prototype.buildKey = function(){
    var _l, iconlabel,reSup,keyhtml;
    for (l in this.lists){
        _l=this.lists[l];
        if (_l.graph.type=='icon'){
            if(_l.graph.iconlabel){
                iconlabel=_l.graph.iconlabel;
            }else{
                iconlabel=_l.graph.icon_unit+' x '+
                gwcat.paramUnit((_l.valcol)?_l.valcol:_l.sortcol);
            };
            iconlabel.replace('M_sun',)
            iconlabel=iconlabel.replace('M_sun','M<sub>☉</sub>')
            reSup=/\^(-?[0-9]*)(?=[\s/]|$)/g
            iconlabel=iconlabel.replace(reSup,"<sup>$1</sup> ");
            keyhtml='<div class="key-icon"><img src="'+_l.graph.icon+'">'+
                '<div class="evname key-icon">'+iconlabel+'</div></div>'
            d3.select('#keyholder > .keyouter').append('div')
                .attr('class','key-item key-icon '+l)
                .html(keyhtml)
        }
    }
}
TopTen.prototype.setList = function(listIn){
    if (this.lists[listIn]){
        this.listName=listIn;
        this.list=this.lists[listIn];
    }
    if (this.debug){console.log('selected',listIn);}
    d3.selectAll('.selector')
        .classed('selected',false);
    d3.select('#selector-'+listIn)
        .classed('selected',true);
    d3.selectAll('.key-item.key-icon')
        .classed('selected',false);
    d3.selectAll('.key-item.key-icon.'+listIn)
        .classed('selected',true);
    this.popList();
    this.makeList();
    window.history.replaceState({},'',this.makeUrl());
}
TopTen.prototype.makeDiv = function(holderid='top10holder'){
    // make divs for single lists
    this.hd=d3.select((this.hid[0]=='#')?this.hid:'#'+this.hid);
    // lid='list-'+l;
    this.hd.append('div')
        .attr('class','list-title')
        .attr('id','list-title');
    this.hd.append('div')
        .attr('class','top10list')
        .attr('id',this.lid);
    this.hd.append('div')
        .attr('class','list-scale hidden')
        .attr('id','list-scale') 
        .html('<div class="evgraph"><div class="scale-bg"></div></div>');
    this.ld=d3.select('#'+this.lid);
    // console.log(this.lid,this.ld);
    return;
}
TopTen.prototype.popList = function(){
    // populate list object with events/values
    // var listitem=this.list;
    var _l=this.list;
    gwcat.orderData(_l.sortcol,(_l.order=='dec')?true:false);
    _l.data=[]
    var num=0;
    for (n in gwcat.dataOrder){
        if (num>=this.N){continue}
        if ((this.incCand==false)&(gwcat.getBest(gwcat.dataOrder[n],'conf')=='Candidate')){continue}
        ev=gwcat.dataOrder[n];
        if (gwcat.getNominal(gwcat.dataOrder[n],_l.sortcol)){
            idx=gwcat.event2idx(ev)
            var dx=gwcat.data[idx];
            dx.tt={};
            dx.tt.n=num;
            dx.tt.valType=gwcat.getParamType(gwcat.dataOrder[n],(_l.valcol)?_l.valcol:_l.sortcol);
            dx.tt.value=gwcat.getNominal(gwcat.dataOrder[n],(_l.valcol)?_l.valcol:_l.sortcol);
            dx.tt.approx=(gwcat.data[n][(_l.valcol)?_l.valcol:_l.sortcol].approx)?gwcat.data[n][(_l.valcol)?_l.valcol:_l.sortcol].approx:false;
            if (_l.show_err){
                dx.tt.errneg=gwcat.getMinVal(gwcat.dataOrder[n],(_l.valcol)?_l.valcol:_l.sortcol);
                dx.tt.errpos=gwcat.getMaxVal(gwcat.dataOrder[n],(_l.valcol)?_l.valcol:_l.sortcol);
            }else{
                dx.tt.errneg=Math.NaN;
                dx.tt.errpos=Math.NaN;
            }
            if (dx[(_l.valcol)?_l.valcol:_l.sortcol].label){
                dx.tt.label=dx[(_l.valcol)?_l.valcol:_l.sortcol].label;
            }else{
                dx.tt.label='';
            }
            num+=1;
            _l.data.push(dx);
        }
    }
    return;
}
TopTen.prototype.reorderList = function(listIn=''){
    // switch ascending or descending
    l=(listIn=='')?this.listName:listIn;
    
    oldorder=this.lists[l].order;
    neworder = (oldorder=='dec')?'asc':'dec';
    this.lists[l].order=neworder;
    order=(this.lists[l].order=='asc')?'&uarr;':'&darr;';
    d3.select('#selorder-'+l).html(order);
    if (l==this.listName){
        this.popList();
        this.makeList();
    }
}
TopTen.prototype.makeList = function(){
    // add entries for list
    var _t10=this;
    var _l=this.list;
    if (this.debug){console.log(this.listName,':',_l);}
    var ldiv=this.ld;
    // console.log(this)
    
    d3.select('#list-title')
        .html(this.gettitle())
    d3.select('#order-ind').on("click",function(){
        _t10.reorderList();
    })
    getClass=function(d){
        evtype=(d.name[0]=='G')?'GW':'Cand';
        evodd=(d.n%2==0)?'even':'odd';
        return('list-item '+evtype+' '+evodd);
    }
    this.ld.selectAll(".list-item").remove()
    ldiv=this.ld.selectAll('.list-item')
        .data(_l.data)
    .enter().append('div')
        .attr('class',getClass)
        .attr('id',function(d){return 'item-'+d.tt.n;})
        .html(function(d){return _t10.gethtml(d,_l)});

    ldiv.each(function(d){
        _t10.addinfo(d,_l);
        if (_l.graph.type=='bar'){
            _t10.addbar(d,_l);
        }
        if (_l.graph.type=='icon' || _l.graph.type=='iconfn'){
            _t10.addicons(d,_l);
        }
    })
    ldiv.each(function(d){
        // console.log(this);
        if (this.clientHeight > 2.5*em2px){
            d3.select('#'+this.id+' > .evname').node().classList.add('vctr')
        }
    })
    if (_l.graph.scale){
        d3.select('#list-scale').classed('hidden',false)
        _t10.addScale(_l)
    }else{
        d3.select('#list-scale').classed('hidden',true)
    }
}

TopTen.prototype.gettitle = function(){
    // get title for list
    var _l=this.list;
    title=(_l.title)?_l.title:gwcat.paramName((_l.valcol)?_l.valcol:_l.sortcol);
    order=(_l.order=='asc')?'&uarr;':'&darr;'
    titorder='<div class="listorder" id="order-ind">'+order+'</div>';
    titname='<div class="listname">'+title+'</div>';
    unit=(_l.unit)?_l.unit:gwcat.paramUnit((_l.valcol)?_l.valcol:_l.sortcol);
    // unit=gwcat.paramUnit(_l.sortcol)
    unit=unit.replace('M_sun','M<sub>☉</sub>')
    reSup=/\^(-?[0-9]*)(?=[\s/]|$)/g
    unit=unit.replace(reSup,"<sup>$1</sup> ");
    titunit='<div class="listunit">'+unit+'</div>';
    return(titorder+titname+titunit)
}
TopTen.prototype.gethtml = function(d,_l){
    // get html for list item
    // var _l=this.list;
    sigfig=(_l.hasOwnProperty('sigfig'))?_l.sigfig:gwcat.datadict[_l.sortcol].sigfig;
    // console.log(d.tt.value);
    var val=setPrecision(d.tt.value,sigfig,_l.format);
    var htmlerr='';
    if (d.tt.valType=='lower'){val='> '+val}
    else if (d.valType=='upper'){val='< '+val}
    if (_l.show_err && d.tt.valType=='best'){
        fixprec=getprecision(d.tt.value,sigfig);
        errpos=setPrecision(d.tt.errpos-d.value,sigfig,fixprec=fixprec,format=_l.format)
        errneg=setPrecision(d.tt.value-d.errneg,sigfig,fixprec=fixprec,format=_l.format)
        htmlerr='<div class="everr pos">+'+errpos+'</div><div class="everr neg">&ndash;'+errneg+'</div>'
    }else{
        htmlerr=''
    }
    var hoverlink='';
    var namelink='';
    if (d.namelink){
        // get skymaps URL
        if (_l.sortcol=='deltaOmega'){
            namelink='<a title="Skymaps" href="skymaps.html#'+d.name+'">';
        }else{
            namelink='';
        }
    }
    var datalink=gwcat.getLink(d.name,'open-data');
    var htmllink='';
    if (datalink.length>0){
        htmllink='<a target="_blank" href="'+datalink[0].url+'"><span class="datalink">i</span></a>';
    }
    htmlname=(namelink) ? '<div class="evname">'+namelink+d.name+'</a></div>' : '<div class="evname">'+htmllink+d.name+'</div>';
    htmlicon='<div class="evgraph"></div>';
    htmlval='<div class="evval">'+val+'</div>';
    // htmlhov='<div class="info">'+this.getinfo(l,n)+'</div>';
    // htmlerr
    return(htmlname+htmlicon+htmlval+htmlerr)
}
TopTen.prototype.addinfo = function(d,_l){
    var ih="",iw="",it="",ib="";
    if (_l.infotype=='skyloc'){
        var hovlink=gwcat.getLink(d.name,'skymap-thumbnail','Cartesian zoomed');
        var hovref='';
        var hovimg='';
        if(hovlink.length>0){
            // console.log(link);
            hovimg='<img class="infoimg skyloc" src="'+hovlink[0].url+'">'
            hovref='<div class="infolink skyloc"><a title="'+hovlink[0].text+'" href="'+hovlink[0].url+'">'+hovlink[0].text+'</a></div>';
        }
        // console.log(l,n,hovlink,hovref)
        // evdiv=d3.select('#item-'+d.tt.n);
        d3.select('#item-'+d.tt.n).append('div')
            .attr('class','info')
            .attr('id','info-'+d.tt.n)
            .html('<div class="infotxt wide">'+hovimg+hovref+'</div>')
        lndiv=d3.select('#info-'+d.tt.n)
        // var iw=lndiv.select('.infotxt').node().clientWidth;
        iw=Math.max(em2px*11,lndiv.select('.infolink').node().clientWidth);
        // lndiv.select('.infotxt').style('width',iw);
        // var ih=lndiv.select('.infotxt').node().clientHeight;
        // var ih="1em";
        // lndiv.select('.infotxt').style('height',ih);
        // lndiv.select('.infotxt').style('top',0);
        // console.log(l,n,iw,ih);
    }else if (_l.infotype=='date'){
        var htmldate=gwcat.getBest(d.name,'UTC').replace('T','<br>')
        d3.select('#item-'+d.tt.n).append('div')
            .attr('class','info')
            .attr('id','info-'+d.tt.n)
            .html('<div class="infotxt">'+htmldate+'</div>')
    }else{
        sigfig=(_l.hasOwnProperty('sigfig'))?_l.sigfig:gwcat.datadict[_l.sortcol].sigfig;
        var val=setPrecision(d.tt.value,sigfig,_l.format);
        if (d.tt.valType=='lower'){val='> '+((d.tt.approx)?'~':'')+val}
        else if (d.tt.valType=='upper'){val='< '+((d.tt.approx)?'~':'')+val}
        var htmlval='<div class="infoval">'+val+'</div>';
        if (_l.show_err && d.tt.valType=='best'){
            var fixprec=getprecision(d.tt.errpos,sigfig,_l.format);
            var errpos=setPrecision(d.tt.errpos-d.tt.value,sigfig,fixprec=fixprec,_l.format)
            var errneg=setPrecision(d.tt.value-d.tt.errneg,sigfig,fixprec=fixprec,_l.format)
            var htmlerr='<div class="infoerr pos">+'+errpos+'</div><div class="infoerr neg">&ndash;'+errneg+'</div>'
        }else{
            var htmlerr='';
        }
        var unit=(_l.unit)?_l.unit:gwcat.paramUnit((_l.valcol)?_l.valcol:_l.sortcol);
        // unit=gwcat.paramUnit(listitem.sortcol)
        unit=unit.replace('M_sun','M<sub>☉</sub>')
        reSup=/\^(-?[0-9]*)(?=[\s/]|$)/g
        unit=unit.replace(reSup,"<sup>$1</sup> ");
        if (d.tt.label){unit=unit+' '+d.tt.label}
        var unitclass= (unit.search('<sup>')>=0)?"infounit high":"infounit";
        var htmlunit='<div class="'+unitclass+'">'+unit+'</div>';
        d3.select('#item-'+d.tt.n).append('div')
            .attr('class','info')
            .attr('id','info-'+d.tt.n)
            .html('<div class="infotxt">'+htmlval+htmlerr+htmlunit+'</div>')

        // set size of objects
        lndiv=d3.select('#info-'+d.tt.n)
        var vw=lndiv.select('.infoval').node().clientWidth+10;
        var uw=lndiv.select('.infounit').node().clientWidth;
        var vh=lndiv.select('.infoval').node().clientHeight;
        var uh=lndiv.select('.infounit').node().clientHeight;
        lndiv.selectAll('.infoerr').style('left',vw);
        var ew=0, eh=0;
        if (_l.show_err && d.tt.valType=='best'){
            ew=Math.max(lndiv.select('.infoerr.pos').node().clientWidth,lndiv.select('.infoerr.neg').node().clientWidth);
            eh=Math.max(lndiv.select('.infoerr.pos').node().clientHeight,lndiv.select('.infoerr.neg').node().clientHeight);
        }
        lndiv.select('.infounit').style('left',vw+ew);
        iw=vw+ew+uw;
        ih=Math.max(vh,eh,uh);
    }
    var lh=d3.select('#item-'+d.tt.n).node().clientHeight;
    if (iw){lndiv.select('.infotxt').style('width',iw);}
    if (ih){lndiv.select('.infotxt').style('height',ih);}
    itop=(it)?it:0;
    
    // lndiv.select('.infotxt').style('top',(it)?it:0);
        // return('<div class="infotxt">'+htmlval+htmlerr+htmlunit+'</div>');
    return;
}
TopTen.prototype.addicons = function(d,_l){
    // add icons to an event entry
    icon_unit=(_l.graph.icon_unit)?_l.graph.icon_unit:1;
    icon_size=(_l.graph.icon_size)?_l.graph.icon_size:1;
    // console.log('icon unit',icon_unit,_l,_l.graph.icon_unit);
    icon_label=(_l.graph.icon_label)?_l.graph.icon_label:'UNKNOWN';
    if (_l.graph.icon_fn){
        nimg=_l.graph.icon_fn(d.tt.value)/icon_unit;
        // console.log(listitem.values[n],listitem.graph.icon_fn(listitem.values[n]));
    }else{
        nimg=d.tt.value/icon_unit;
    }
    if (typeof _l.graph.icon==="function"){
        icon=_l.graph.icon(d.tt.value);
    }else{
        icon=_l.graph.icon;
    }
    // console.log(this);
    fullimgwid=(icon_size*this.iconwid)+'em';
    partimgwid=(icon_size*this.iconwid*(nimg%1))+'em';
    evdiv=d3.select('#item-'+d.tt.n+' .evgraph');
    for (i=1;i<=nimg;i++){
        evdiv.append('div')
            .attr('class','icon '+'icon-'+d.tt.n)
            .attr('id','icon-'+d.tt.n+'-'+i)
        .append('img')
            .attr('src',icon)
            .style('width',fullimgwid)
    }
    if ((nimg%1)!=0){
        evdiv.append('div')
            .attr('class','icon part '+'icon-'+d.tt.n)
            .attr('id','icon-part-'+d.tt.n)
        .append('img')
            .attr('src',icon)
            .attr('id','icon-part-img-'+d.tt.n)
            .style('width',fullimgwid)
        partimg=d3.select('.icon.part.'+'icon-'+d.tt.n);
        partimg.style('width',partimgwid);
    }
    return
}
TopTen.prototype.getBarMin = function () {
    var _l=this.list;
    var show_err=(_l.show_err)?_l.show_err:false;
    bar_min=(_l.graph.bar_min)?_l.graph.bar_min:0;
    if (bar_min=='auto'){
        if (show_err){
            minval=Math.min.apply(Math,_l.data.map(function(d){return(d.tt.errneg)}));
        }else{
            minval=Math.min.apply(Math,_l.data.map(function(d){return(d.tt.value)}));
        }
        bar_min=10**Math.floor(Math.log10(minval))*(Math.floor(minval/10**Math.floor(Math.log10(minval)))-1);
    }
    return bar_min;
};
TopTen.prototype.getBarMax = function () {
    var _l=this.list;
    var show_err=(_l.show_err)?_l.show_err:false;
    bar_max=(_l.graph.bar_max)?_l.graph.bar_max:1;
    if (bar_max=='auto'){
        if (show_err){
            maxval=Math.max.apply(Math,_l.data.map(function(d){return(d.tt.errpos)}));
        }else{
            maxval=Math.max.apply(null,Math,_l.data.map(function(d){return(d.tt.value)}));
        }
        bar_max=10**Math.floor(Math.log10(maxval))*(Math.floor(maxval/10**Math.floor(Math.log10(maxval)))+1);
    }
    return bar_max;
};
TopTen.prototype.getBarLen = function(val,_l){
    var bar_log=(_l.graph.bar_log)?_l.graph.bar_log:false;
    var bmin=_l.graph.bar_minv;
    var bmax=_l.graph.bar_maxv;
    if (bar_log){
        barlen=100*(Math.log(val)-Math.log(bmin))/(Math.log(bmax)-Math.log(bmin));}
    else{barlen=100*(val-bmin)/(bmax-bmin);}
    return barlen;
}
TopTen.prototype.addbar = function(d,_l){
    if (this.debug){console.log('add bar',d.name,d.tt.value);}
    // add bar for an event, with error bars if values are present
    var show_err=(_l.show_err)?_l.show_err:false;
    var bar_log=(_l.graph.bar_log)?_l.graph.bar_log:false;
    var bar_img=(_l.graph.bar_img)?_l.graph.bar_img:false;
    var bar_height=(_l.graph.bar_height)?_l.graph.bar_height:'auto';
    var bar_col=(_l.graph.bar)?_l.graph.bar_col:false;
    var bar_marker=(_l.graph.marker)?_l.graph.marker:false;
    _l.graph.bar_minv=this.getBarMin();
    _l.graph.bar_maxv=this.getBarMax();
    // if (bar_max=='auto'){
    //     bar_max=this.getBarMax(_l)
    // }
    // if (_l.graph.bar_min=='auto'){
    //     bar_min=this.getBarMin(_l)
    // }
    var barlen=this.getBarLen(d.tt.value,_l);
    // if (bar_log){
    //     barlen=100*(Math.log(d.tt.value)-Math.log(bar_min))/(Math.log(bar_max)-Math.log(bar_min));}
    // else{barlen=100*(d.tt.value-bar_min)/(bar_max-bar_min);}
    console.log(bar_min,bar_max,barlen);
    evdiv=d3.select('#item-'+d.tt.n+' .evgraph');
    if (bar_img){
        evdiv.append('div')
            .attr('class','bar-bg img')
            .attr('id','bar-bg-'+d.tt.n);
        var barbg=evdiv.select('#bar-bg-'+d.tt.n);
        var barbgw=barbg.node().clientWidth;
        // barbg.classed('barbg-img',true);
        barbg.append('div')
            .attr('class','barimg')
            .attr('id','barimg-'+'-'+d.tt.n)
            .style('width',(barlen)+'%');
        barbg.select('.barimg').append('img')
            .attr('src',bar_img)
            .style('width',barbgw);
        // if ()
        evdiv.style('height',bar_height);
    }else{
        evdiv.append('div')
            .attr('class','bar-bg')
            .attr('id','bar-bg-'+d.tt.n)
        var barbg=evdiv.select('#bar-bg-'+d.tt.n)
        if (bar_marker){
            barbg.append('div')
                .attr('class','bar')
                .attr('id','bar-'+d.tt.n)
                .style('left',(barlen)+'%')
                .style('width','3px');
        }else{
            barbg.append('div')
                .attr('class','bar')
                .attr('id','bar-'+d.tt.n)
                .style('width',(barlen)+'%');
        }
    }
    // var barbg=evdiv.select('#bar-bg-'+l+'-'+n)
    if (show_err){
        if (bar_log){
            errmin=100*(Math.log(d.tt.errneg)-Math.log(_l.graph.bar_minv))/
                (Math.log(_l.graph.bar_maxv)-Math.log(_l.graph.bar_minv));
            errmax=100*(Math.log(d.tt.errpos)-Math.log(_l.graph.bar_minv))/
                (Math.log(_l.graph.bar_maxv)-Math.log(_l.graph.bar_minv));
        }else{
            errmin=100*(d.tt.errneg-_l.graph.bar_minv)/(_l.graph.bar_maxv-_l.graph.bar_minv);
            errmax=100*(d.tt.errpos-_l.graph.bar_minv)/(_l.graph.bar_maxv-_l.graph.bar_minv);
        }
        barbg.append('div')
            .attr('class','errbar neg')
            .attr('id','errbar-'+d.tt.n)
            .style('left',(errmin)+'%')
            .style('width',(barlen-errmin)+'%');
        barbg.append('div')
            .attr('class','errbar pos')
            .attr('id','errbar-'+d.tt.n)
            .style('left',(barlen)+'%')
            .style('width',(errmax-barlen)+'%');
        barbg.append('div')
            .attr('class','errmin2')
            .attr('id','errmin2-'+d.tt.n)
            .style('left',(errmin)+'%');
        barbg.append('div')
            .attr('class','errmax2')
            .attr('id','errmax2-'+d.tt.n)
            .style('left',(errmax)+'%');
    }
    // if (bar_img){
    //     barbg
    // 
    // }
}
TopTen.prototype.addScale = function(_l){
    if (!this.scales[_l.graph.scale]){
        return;
    }else{
        var lsc=d3.select('#list-scale > .evgraph > .scale-bg');
        
        // get top10 list height
        var t10h=d3.select('#list-holder').node().clientHeight;
        
        lsc.selectAll('*').remove()
        for (s in this.scales[_l.graph.scale]){
            var sc=this.scales[_l.graph.scale][s];
            if (sc.xfn){
                sc.x=sc.xfn();
            }
            if (sc.lfn){
                sc.l=sc.lfn();
            }
            if ((sc.x>=_l.graph.bar_minv)&(sc.x<=_l.graph.bar_maxv)){
                var scx=this.getBarLen(sc.x,_l);
                if ((scx>0)&(scx<2)){
                    continue;
                }
                if (!sc.noline){
                    lsc.append('div')
                        .attr('class','scale-item')
                        .attr('id','scale-item-'+s)
                        .style('left',(scx)+'%')
                        .style('top',(-t10h-10)+'px')
                        .style('height',(t10h+20)+'px');
                }
                lsc.append('div')
                    .attr('class','scale-label')
                    .attr('id','scale-label-'+s)
                    .style('left',(scx)+'%')
                    // .style('top','10px')
                    .html(sc.l);
            }
        }
        var sclw=0;
        d3.selectAll('.scale-label').each(function(){
            this.style.top=(this.clientWidth+10)+'px'
            sclw=(this.clientWidth>sclw)?this.clientWidth:sclw;
        })
        d3.select('#list-scale')
            .style('height',(sclw+20)+'px');
    }
}
function addColumn(colname,fncalc,dict){
    // add a column to the data
    if (typeof fncalc === "function"){
        gwcat.datadict[colname]=dict;
        for (e in gwcat.data){
            ev=gwcat.data[e].name;
            val=fncalc(ev);
            if (val){gwcat.data[e][colname]=val}
        }
    }
}
function calcMratio(ev){
    // calculate mass ratio (with basic error propogation)
    if (gwcat.getBest(ev,'M2') && gwcat.getBest(ev,'M1')){
        best=gwcat.getBest(ev,'M2')/gwcat.getBest(ev,'M1');
        low1=1 - (gwcat.getMinVal(ev,'M1')/gwcat.getBest(ev,'M1'));
        low2=1 - (gwcat.getMinVal(ev,'M2')/gwcat.getBest(ev,'M2'));
        high1=1 - (gwcat.getMaxVal(ev,'M1')/gwcat.getBest(ev,'M1'));
        high2=1 - (gwcat.getMaxVal(ev,'M2')/gwcat.getBest(ev,'M2'));
        lowr=Math.sqrt((low1**2 + low2**2))
        highr=Math.sqrt((high1**2 + high2**2))
        highr=(highr+best>1)?1-best:highr;
        return {'best':best,'err':[-lowr,highr]}
    }else{return Math.NaN}
}
function calcMtotal(ev){
    // calculate total mass (with basic error propogation)
    if (gwcat.getBest(ev,'M2') && gwcat.getBest(ev,'M1')){
        best=gwcat.getBest(ev,'M2')+gwcat.getBest(ev,'M1');
        low1=1 - (gwcat.getMinVal(ev,'M1')/gwcat.getBest(ev,'M1'));
        low2=1 - (gwcat.getMinVal(ev,'M2')/gwcat.getBest(ev,'M2'));
        high1=1 - (gwcat.getMaxVal(ev,'M1')/gwcat.getBest(ev,'M1'));
        high2=1 - (gwcat.getMaxVal(ev,'M2')/gwcat.getBest(ev,'M2'));
        lowr=Math.sqrt((low1**2 + low2**2))
        highr=Math.sqrt((high1**2 + high2**2))
        return {'best':best,'err':[-lowr,highr]}
    }else{return Math.NaN}
}
function calcDelay(ev){
    // calculate delay since previous event (NB: assumes events are in ascending ordered by date)
    idx=gwcat.event2idx(ev);
    var obsruns={
        O1:{start:new Date('2015-09-12T00:00:00'),end:new Date('2016-01-19T16:00:00')},
        O2:{start:new Date('2016-11-30T16:00:00'),end:new Date('2017-08-25T22:00:00')},
        O3:{start:new Date('2019-04-01T16:00:00'),end:new Date('2020-04-01T22:00:00')}
    }
    var label='';
    if (idx==0){
        obs=gwcat.data[idx].obsrun.best;
        date1=obsruns[obs].start;
        // return(Math.POSITIVE_INFINITY)}
        label='since start of '+obs;
    }else{
        date1=new Date(gwcat.data[idx-1].UTC.best);
        label='since '+gwcat.data[idx-1].name;
    }
    date2=new Date(gwcat.data[idx].UTC.best);
    datediff=(date2-date1)/(86400*1000);
    return {'best':datediff,'label':label};
}
function iconFARfn(far){
    if (far>1){
        return Math.log10(far);
    }else{
        return -Math.log10(far);
    }

}
function imgFARfn(far){
    if (far>1){
        return 'img/unsmiley.svg';
    }else{
        return 'img/smiley.svg';
    }
}
function getprecision(val,sigfig){
    // get precision of a number (for replicating with error value)
    return Math.floor(Math.log10(Math.abs(val)))+1-sigfig;
}
function setPrecision(val,sigfig,fixprec,format){
    // set the displayed precision of a number, based on the sigfig, unless fixprec is given
    if (format=='fixed'){
        valOut=val.toFixed(sigfig);
    }else if(format=='exp'){
        valOut=val.toExponential(sigfig);
    }else if(format=='date'){
        reDate=/(.*)T(.*)/g
        valOut=val.replace(reDate,"$1");
    }else{
        // automatic
        if (typeof val === "number"){
            prec=(fixprec)?fixprec:getprecision(val,sigfig);
            if (Math.abs(val) > 10**(-sigfig)){
                valOut=10**prec * Math.round(val/10**prec);
                valOut=(prec<0)?valOut.toFixed(-prec):valOut;
            }else if (val==0){
                valOut=(fixprec)?val.toFixed(-fixprec):0;
            }else{
                valOut=val.toExponential(sigfig-1);
                reDate=/(.*)e(.*)/g
                valOut=valOut.replace(reDate,"$1x10<sup>$2</sup>");
            }
        }else{console.log(val,typeof val)}
    }
    return valOut;
}