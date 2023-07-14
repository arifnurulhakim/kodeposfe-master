import{P as E}from"./ProductService-c3f21ab6.js";import{r as a,s as F,v as M,o as z,b as r,x as G,c as H,d as J,e,f as t,g as s,y as D,q as K,t as Q}from"./index-3318d3fe.js";const W="/demo/images/nature/nature9.jpg",X={class:"grid"},ee={class:"col-12 lg:col-6"},te={class:"card p-fluid"},oe=e("h5",null,"Dialog",-1),ie=e("p",{class:"line-height-3 m-0"}," Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",-1),le={class:"card p-fluid"},se=e("h5",null,"Overlay Panel",-1),ne={class:"flex flex-wrap gap-2"},ae=e("img",{src:W,alt:"Nature 9"},null,-1),re=["src","alt"],ce={class:"col-12 lg:col-6"},ue={class:"card p-fluid"},de=e("h5",null,"Confirmation",-1),pe=e("div",{class:"flex align-items-center justify-content-center"},[e("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}}),e("span",null,"Are you sure you want to proceed?")],-1),me={class:"card"},ve=e("h5",null,"Sidebar",-1),fe=e("h1",{style:{"font-weight":"normal"}},"Left Sidebar",-1),be=e("h1",{style:{"font-weight":"normal"}},"Right Sidebar",-1),_e=e("h1",{style:{"font-weight":"normal"}},"Top Sidebar",-1),ge=e("h1",{style:{"font-weight":"normal"}},"Bottom Sidebar",-1),he=e("h1",{style:{"font-weight":"normal"}},"Full Screen",-1),ye={class:"col-12 lg:col-6"},we={class:"card"},Ce=e("h5",null,"Tooltip",-1),xe={class:"formgroup-inline"},ke={class:"field"},Se={class:"col-12 lg:col-6"},Te={class:"card"},De=e("h5",null,"ConfirmPopup",-1),qe={__name:"Overlay",setup(Pe){const u=a(!1),d=a(!1),p=a(!1),m=a(!1),v=a(!1),f=a(!1),b=a(!1),y=a(null),w=a(null),_=a(null),C=a(null),P=a(null),U=new E,g=F(),I=M();z(()=>{U.getProductsSmall().then(n=>y.value=n)});const q=()=>{u.value=!0},B=()=>{u.value=!1},N=()=>{d.value=!0},x=()=>{d.value=!1},j=n=>{_.value.toggle(n)},L=n=>{C.value.toggle(n)},O=n=>n.toLocaleString("en-US",{style:"currency",currency:"USD"}),Z=n=>{_.value.hide(),g.add({severity:"info",summary:"Product Selected",detail:n.data.name,life:3e3})},$=n=>{I.require({target:n.target,message:"Are you sure you want to proceed?",icon:"pi pi-exclamation-triangle",accept:()=>{g.add({severity:"info",summary:"Confirmed",detail:"You have accepted",life:3e3})},reject:()=>{g.add({severity:"info",summary:"Rejected",detail:"You have rejected",life:3e3})}})};return(n,o)=>{const l=r("Button"),k=r("Dialog"),S=r("OverlayPanel"),h=r("Column"),R=r("DataTable"),c=r("Sidebar"),Y=r("InputText"),V=r("ConfirmPopup"),A=r("Toast"),T=G("tooltip");return H(),J("div",X,[e("div",ee,[e("div",te,[oe,t(k,{header:"Dialog",visible:u.value,"onUpdate:visible":o[0]||(o[0]=i=>u.value=i),breakpoints:{"960px":"75vw"},style:{width:"30vw"},modal:!0},{footer:s(()=>[t(l,{label:"Ok",onClick:B,icon:"pi pi-check",class:"p-button-outlined"})]),default:s(()=>[ie]),_:1},8,["visible"]),t(l,{label:"Show",icon:"pi pi-external-link",style:{width:"auto"},onClick:q})]),e("div",le,[se,e("div",ne,[e("div",null,[t(l,{type:"button",label:"Image",onClick:j,class:"p-button-success"}),t(S,{ref_key:"op",ref:_,appendTo:"body",showCloseIcon:!0},{default:s(()=>[ae]),_:1},512)]),e("div",null,[t(l,{type:"button",label:"DataTable",onClick:L,class:"p-button-success"}),t(S,{ref_key:"op2",ref:C,appendTo:"body",showCloseIcon:!0,id:"overlay_panel",style:{width:"450px"}},{default:s(()=>[t(R,{value:y.value,selection:w.value,"onUpdate:selection":o[1]||(o[1]=i=>w.value=i),selectionMode:"single",paginator:!0,rows:5,onRowSelect:Z,responsiveLayout:"scroll"},{default:s(()=>[t(h,{field:"name",header:"Name",sortable:!0,headerStyle:"min-width:12rem;"}),t(h,{header:"Image",headerStyle:"min-width:5rem;"},{body:s(i=>[e("img",{src:"demo/images/product/"+i.data.image,alt:i.data.image,width:"50",class:"shadow-2"},null,8,re)]),_:1}),t(h,{field:"price",header:"Price",sortable:!0,headerStyle:"min-width:8rem;"},{body:s(i=>[K(Q(O(i.data.price)),1)]),_:1})]),_:1},8,["value","selection"])]),_:1},512)])])])]),e("div",ce,[e("div",ue,[de,t(l,{label:"Delete",icon:"pi pi-trash",class:"p-button-danger",style:{width:"auto"},onClick:N}),t(k,{header:"Confirmation",visible:d.value,"onUpdate:visible":o[2]||(o[2]=i=>d.value=i),style:{width:"350px"},modal:!0},{footer:s(()=>[t(l,{label:"No",icon:"pi pi-times",onClick:x,class:"p-button-text"}),t(l,{label:"Yes",icon:"pi pi-check",onClick:x,class:"p-button-text",autofocus:""})]),default:s(()=>[pe]),_:1},8,["visible"])]),e("div",me,[ve,t(c,{visible:p.value,"onUpdate:visible":o[3]||(o[3]=i=>p.value=i),baseZIndex:1e3},{default:s(()=>[fe]),_:1},8,["visible"]),t(c,{visible:m.value,"onUpdate:visible":o[4]||(o[4]=i=>m.value=i),baseZIndex:1e3,position:"right"},{default:s(()=>[be]),_:1},8,["visible"]),t(c,{visible:v.value,"onUpdate:visible":o[5]||(o[5]=i=>v.value=i),baseZIndex:1e3,position:"top"},{default:s(()=>[_e]),_:1},8,["visible"]),t(c,{visible:f.value,"onUpdate:visible":o[6]||(o[6]=i=>f.value=i),baseZIndex:1e3,position:"bottom"},{default:s(()=>[ge]),_:1},8,["visible"]),t(c,{visible:b.value,"onUpdate:visible":o[7]||(o[7]=i=>b.value=i),baseZIndex:1e3,position:"full"},{default:s(()=>[he]),_:1},8,["visible"]),t(l,{icon:"pi pi-arrow-right",class:"p-button-warning",onClick:o[8]||(o[8]=i=>p.value=!0),style:{"margin-right":"0.25em"}}),t(l,{icon:"pi pi-arrow-left",class:"p-button-warning",onClick:o[9]||(o[9]=i=>m.value=!0),style:{"margin-right":"0.25em"}}),t(l,{icon:"pi pi-arrow-down",class:"p-button-warning",onClick:o[10]||(o[10]=i=>v.value=!0),style:{"margin-right":"0.25em"}}),t(l,{icon:"pi pi-arrow-up",class:"p-button-warning",onClick:o[11]||(o[11]=i=>f.value=!0),style:{"margin-right":"0.25em"}}),t(l,{icon:"pi pi-external-link",class:"p-button-warning",onClick:o[12]||(o[12]=i=>b.value=!0)})])]),e("div",ye,[e("div",we,[Ce,e("div",xe,[e("div",ke,[D(t(Y,{type:"text",placeholder:"Username"},null,512),[[T,"Your username"]])]),D(t(l,{type:"button",label:"Save",icon:"pi pi-check"},null,512),[[T,"Click to proceed"]])])])]),e("div",Se,[e("div",Te,[De,t(V),t(A),t(l,{ref_key:"popup",ref:P,onClick:o[13]||(o[13]=i=>$(i)),icon:"pi pi-check",label:"Confirm",class:"mr-2"},null,512)])])])}}};export{qe as default};
