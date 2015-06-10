$("[name='my-checkbox']").bootstrapSwitch();
$('input[name="my-checkbox"]').on('switchChange.bootstrapSwitch', function(event, state) {

  if (state==true){
    reorder_clust_rank('clust');
  }
  else {
    reorder_clust_rank('rank');
  }
});

