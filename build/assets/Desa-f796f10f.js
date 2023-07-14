import{_ as ae,s as le,r as n,k as te,o as se,E as K,l as oe,b as k,c as f,d as b,e as s,f as t,g as d,q as p,t as m,n as N,i as g,p as de,j as ie}from"./index-3318d3fe.js";const i=P=>(de("data-v-bf869e0f"),P=P(),ie(),P),ne={class:"grid"},ue={class:"col-12"},re={class:"card"},ce={class:"my-2"},ve={class:"flex flex-column md:flex-row md:justify-content-between md:align-items-center"},pe=i(()=>s("h5",{class:"m-0"},"Desa",-1)),me={class:"block mt-2 md:mt-0 p-input-icon-left"},_e=i(()=>s("i",{class:"pi pi-search"},null,-1)),ke=i(()=>s("span",{class:"p-column-title"},"Kode Desa",-1)),fe=i(()=>s("span",{class:"p-column-title"},"Kode Kecamatan",-1)),be=i(()=>s("span",{class:"p-column-title"},"Kode Kabupaten",-1)),he=i(()=>s("span",{class:"p-column-title"},"Kode Provinsi",-1)),ye=i(()=>s("span",{class:"p-column-title"},"Nama Desa",-1)),ge=i(()=>s("span",{class:"p-column-title"},"Nama Kecamatan",-1)),De=i(()=>s("span",{class:"p-column-title"},"Nama Kabupaten",-1)),we=i(()=>s("span",{class:"p-column-title"},"Nama Provinsi",-1)),xe={class:"field"},Ce=i(()=>s("label",{for:"kode_desa"},"Kode Desa",-1)),Se={key:0,class:"p-invalid"},Ve={class:"field"},Ke=i(()=>s("label",{for:"kode_kec"},"Kode Kecamatan",-1)),Ne={key:0,class:"p-invalid"},Pe={class:"field"},Te=i(()=>s("label",{for:"kode_kab"},"Kode Kabupaten",-1)),Ue={key:0,class:"p-invalid"},Ie={class:"field"},qe=i(()=>s("label",{for:"kode_prov"},"Kode Provinsi",-1)),Me={key:0,class:"p-invalid"},$e={class:"field"},Be=i(()=>s("label",{for:"nama_desa"},"Nama Desa",-1)),Fe={key:0,class:"p-invalid"},Re={class:"flex align-items-center justify-content-center"},Ee=i(()=>s("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1)),Le={key:0},Ae={class:"flex align-items-center justify-content-center"},je=i(()=>s("i",{class:"pi pi-exclamation-triangle mr-3",style:{"font-size":"2rem"}},null,-1)),ze={key:0},Oe={__name:"Desa",setup(P){const h=le(),c=n(null),_=n(!1),x=n(!1),C=n(!1),e=n({}),y=n(null),M=n(null),T=n({}),u=n(!1),S=n(1),U=n(10),V=n(0),I=n(!1),F="pi pi-spin pi-spinner",$=n("");te(()=>{Q()}),se(()=>{B()});const B=()=>{I.value=!0,K.get("api/desa",{params:{first:S.value,last:U.value}}).then(o=>{o.data.status==="success"&&(c.value=o.data.data,V.value=o.data.total_data,$.value=`Showing ${S.value} to ${U.value} of ${V.value} desas`)}).catch(o=>{console.error(o),h.add({severity:"error",summary:"Error",detail:"Failed to fetch data",life:3e3})}).finally(()=>{I.value=!1})},R=o=>{S.value=o.first+1,U.value=o.first+o.rows,B()},E=()=>{e.value={},u.value=!1,_.value=!0},L=()=>{_.value=!1,u.value=!1},A=async()=>{if(u.value=!0,e.value.kode_desa&&e.value.kode_kec&&e.value.kode_kab&&e.value.kode_prov&&e.value.nama_desa){if(console.log(e.value.id),e.value.id){const o=Y(e.value.id);c.value[o]=e.value,await K.put(`/api/desa/${e.value.id}`,{kode_desa:e.value.kode_desa,kode_kec:e.value.kode_kec,kode_prov:e.value.kode_prov,nama_desa:e.value.nama_desa}),h.add({severity:"success",summary:"Successful",detail:"Desa Updated",life:3e3}),_.value=!1,e.value={}}else c.value.push(e.value),await K.post("/api/desa",{kode_desa:e.value.kode_desa,kode_kec:e.value.kode_kec,kode_kab:e.value.kode_kab,kode_prov:e.value.kode_prov,nama_desa:e.value.nama_desa}),h.add({severity:"success",summary:"Successful",detail:"Desa Created",life:3e3}),_.value=!1,e.value={};_.value=!1,e.value={}}},j=o=>{e.value={...o},console.log(e),_.value=!0},z=o=>{e.value=o,x.value=!0},O=async()=>{try{await K.delete(`/api/desa/${e.value.id}`),c.value=c.value.filter(o=>o.id!==e.value.id),x.value=!1,e.value={},h.add({severity:"success",summary:"Successful",detail:"Desa Deleted",life:3e3})}catch(o){console.error(o),h.add({severity:"error",summary:"Error",detail:"An error occurred",life:3e3})}},Y=o=>{let l=-1;for(let D=0;D<c.value.length;D++)if(c.value[D].id===o){l=D;break}return l},G=()=>{M.value.exportCSV()},H=()=>{C.value=!0},J=async()=>{try{const o=y.value.map(l=>l.id);await K.delete("/api/desa",{data:{ids:o}}),c.value=c.value.filter(l=>!y.value.includes(l)),C.value=!1,y.value=null,h.add({severity:"success",summary:"Successful",detail:"Desas Deleted",life:3e3})}catch(o){console.error(o),h.add({severity:"error",summary:"Error",detail:"An error occurred",life:3e3})}},Q=()=>{T.value={global:{value:null,matchMode:oe.CONTAINS}}};return(o,l)=>{const D=k("Toast"),r=k("Button"),W=k("FileUpload"),X=k("Toolbar"),w=k("InputText"),v=k("Column"),Z=k("DataTable"),q=k("Dialog");return f(),b("div",ne,[s("div",ue,[s("div",re,[t(D),t(X,{class:"mb-4"},{start:d(()=>[s("div",ce,[t(r,{label:"New",icon:"pi pi-plus",class:"p-button-success mr-2",onClick:E}),t(r,{label:"Delete",icon:"pi pi-trash",class:"p-button-danger",onClick:H,disabled:!y.value||!y.value.length},null,8,["disabled"])])]),end:d(()=>[t(W,{mode:"basic",accept:"image/*",maxFileSize:1e6,label:"Import",chooseLabel:"Import",class:"mr-2 inline-block"}),t(r,{label:"Export",icon:"pi pi-upload",class:"p-button-help",onClick:l[0]||(l[0]=a=>G(a))})]),_:1}),t(Z,{ref_key:"dt",ref:M,value:c.value,selection:y.value,"onUpdate:selection":l[2]||(l[2]=a=>y.value=a),dataKey:"id",paginator:!0,rows:U.value,filters:T.value,first:S.value,"onUpdate:first":l[3]||(l[3]=a=>S.value=a),last:V.value,"onUpdate:last":l[4]||(l[4]=a=>V.value=a),totalRecords:V.value,paginatorTemplate:"FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown",rowsPerPageOptions:[5,10,25],loading:I.value,currentPageReportTemplate:$.value,loadingIcon:F,onPage:R},{header:d(()=>[s("div",ve,[pe,s("span",me,[_e,t(w,{modelValue:T.value.global.value,"onUpdate:modelValue":l[1]||(l[1]=a=>T.value.global.value=a),placeholder:"Search..."},null,8,["modelValue"])])])]),default:d(()=>[t(v,{selectionMode:"multiple",headerStyle:"width: 3rem"}),t(v,{field:"kode_desa",header:"kode desa",sortable:!0,headerStyle:"width:40%; min-width:10rem;"},{body:d(a=>[ke,p(" "+m(a.data.kode_desa),1)]),_:1}),t(v,{field:"kode_kec",header:"kode kecamatan",sortable:!0,headerStyle:"width:40%; min-width:10rem;"},{body:d(a=>[fe,p(" "+m(a.data.kode_kec),1)]),_:1}),t(v,{field:"kode_kab",header:"kode kabupaten",sortable:!0,headerStyle:"width:40%; min-width:10rem;"},{body:d(a=>[be,p(" "+m(a.data.kode_kab),1)]),_:1}),t(v,{field:"kode_prov",header:"kode provinsi",sortable:!0,headerStyle:"width:40%; min-width:10rem;"},{body:d(a=>[he,p(" "+m(a.data.kode_prov),1)]),_:1}),t(v,{field:"nama_desa",header:"nama desa",sortable:!0,headerStyle:"width:40%; min-width:10rem;"},{body:d(a=>[ye,p(" "+m(a.data.nama_desa),1)]),_:1}),t(v,{field:"nama_kecamatan",header:"nama kecamatan",sortable:!0,headerStyle:"width:40%; min-width:10rem;"},{body:d(a=>[ge,p(" "+m(a.data.nama_kecamatan),1)]),_:1}),t(v,{field:"nama_kabupaten",header:"nama kabupaten",sortable:!0,headerStyle:"width:10%; min-width:10rem;"},{body:d(a=>[De,p(" "+m(a.data.nama_kabupaten),1)]),_:1}),t(v,{field:"nama_provinsi",header:"nama provinsi",sortable:!0,headerStyle:"width:10%; min-width:10rem;"},{body:d(a=>[we,p(" "+m(a.data.nama_provinsi),1)]),_:1}),t(v,{headerStyle:"min-width:10rem;"},{body:d(a=>[t(r,{icon:"pi pi-pencil",class:"p-button-rounded p-button-success mr-2",onClick:ee=>j(a.data)},null,8,["onClick"]),t(r,{icon:"pi pi-trash",class:"p-button-rounded p-button-warning mt-2",onClick:ee=>z(a.data)},null,8,["onClick"])]),_:1})]),_:1},8,["value","selection","rows","filters","first","last","totalRecords","loading","currentPageReportTemplate"]),t(q,{visible:_.value,"onUpdate:visible":l[10]||(l[10]=a=>_.value=a),style:{width:"450px"},header:"Desa Details",modal:!0,class:"p-fluid"},{footer:d(()=>[t(r,{label:"Cancel",icon:"pi pi-times",class:"p-button-text",onClick:L}),t(r,{label:"Save",icon:"pi pi-check",class:"p-button-text",onClick:A})]),default:d(()=>[s("div",xe,[Ce,t(w,{id:"kode_desa    ",modelValue:e.value.kode_desa,"onUpdate:modelValue":l[5]||(l[5]=a=>e.value.kode_desa=a),modelModifiers:{trim:!0},required:"true",autofocus:"",class:N({"p-invalid":u.value&&!e.value.kode_desa})},null,8,["modelValue","class"]),u.value&&!e.value.kode_desa?(f(),b("small",Se,"Kode is required.")):g("",!0)]),s("div",Ve,[Ke,t(w,{id:"kode_kec",modelValue:e.value.kode_kec,"onUpdate:modelValue":l[6]||(l[6]=a=>e.value.kode_kec=a),modelModifiers:{trim:!0},required:"true",autofocus:"",class:N({"p-invalid":u.value&&!e.value.kode_kec})},null,8,["modelValue","class"]),u.value&&!e.value.kode_kec?(f(),b("small",Ne,"Kode is required.")):g("",!0)]),s("div",Pe,[Te,t(w,{id:"kode_kab",modelValue:e.value.kode_kab,"onUpdate:modelValue":l[7]||(l[7]=a=>e.value.kode_kab=a),modelModifiers:{trim:!0},required:"true",autofocus:"",class:N({"p-invalid":u.value&&!e.value.kode_kab})},null,8,["modelValue","class"]),u.value&&!e.value.kode_kab?(f(),b("small",Ue,"Kode Desa is required.")):g("",!0)]),s("div",Ie,[qe,t(w,{id:"kode_prov",modelValue:e.value.kode_prov,"onUpdate:modelValue":l[8]||(l[8]=a=>e.value.kode_prov=a),modelModifiers:{trim:!0},required:"true",autofocus:"",class:N({"p-invalid":u.value&&!e.value.kode_prov})},null,8,["modelValue","class"]),u.value&&!e.value.kode_prov?(f(),b("small",Me,"Kode Desa is required.")):g("",!0)]),s("div",$e,[Be,t(w,{id:"nama_desa",modelValue:e.value.nama_desa,"onUpdate:modelValue":l[9]||(l[9]=a=>e.value.nama_desa=a),modelModifiers:{trim:!0},required:"true",autofocus:"",class:N({"p-invalid":u.value&&!e.value.nama_desa})},null,8,["modelValue","class"]),u.value&&!e.value.nama_desa?(f(),b("small",Fe,"Nama Desa is required.")):g("",!0)])]),_:1},8,["visible"]),t(q,{visible:x.value,"onUpdate:visible":l[12]||(l[12]=a=>x.value=a),style:{width:"450px"},header:"Confirm",modal:!0},{footer:d(()=>[t(r,{label:"No",icon:"pi pi-times",class:"p-button-text",onClick:l[11]||(l[11]=a=>x.value=!1)}),t(r,{label:"Yes",icon:"pi pi-check",class:"p-button-text",onClick:O})]),default:d(()=>[s("div",Re,[Ee,e.value?(f(),b("span",Le,[p("Are you sure you want to delete "),s("b",null,m(e.value.name),1),p("?")])):g("",!0)])]),_:1},8,["visible"]),t(q,{visible:C.value,"onUpdate:visible":l[14]||(l[14]=a=>C.value=a),style:{width:"450px"},header:"Confirm",modal:!0},{footer:d(()=>[t(r,{label:"No",icon:"pi pi-times",class:"p-button-text",onClick:l[13]||(l[13]=a=>C.value=!1)}),t(r,{label:"Yes",icon:"pi pi-check",class:"p-button-text",onClick:J})]),default:d(()=>[s("div",Ae,[je,e.value?(f(),b("span",ze,"Are you sure you want to delete the selected desas?")):g("",!0)])]),_:1},8,["visible"])])])])}}},Ge=ae(Oe,[["__scopeId","data-v-bf869e0f"]]);export{Ge as default};
