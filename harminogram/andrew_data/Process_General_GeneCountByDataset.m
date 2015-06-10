


clear all;

folder = {'PreparedData' 'PreparedData' 'PreparedData' 'PreparedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'PreparedData' 'PreparedData' 'PreparedData' 'ImportedData' 'PreparedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ProcessedData/nursa/gene' 'ProcessedData/cheanomerge/gene' 'ProcessedData/encode20150122/gene' 'ProcessedData/motifmap20150109/gene' 'ProcessedData/pcppiallphysical20150113/gene' 'PreparedData' 'PreparedData' 'PreparedData' 'PreparedData' 'PreparedData' 'PreparedData' 'PreparedData' 'ImportedData' 'ImportedData' 'PreparedData' 'ProcessedData/heiser/gene' 'ProcessedData/gdsc/gene' 'ProcessedData/cosmicmut/gene' 'ProcessedData/cosmiccnvnew/gene' 'ProcessedData/cclecnv/gene' 'ProcessedData/ccle/gene' 'PreparedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData' 'ImportedData'}';

resource = {'brainatlas_humandevelopmentrnaseq_20150413' 'brainatlas_humandevelopmentarray_20150413' 'brainatlas_humanadultarray_20150413' 'brainatlas_humanprenatalarray_20150413' 'biogrid_20150415' 'clinvar_pathogenic_20150415' 'drugbank_20150416' 'mirtarbaseviapc_20150416' 'transfacviapc_20150416' 'bindviapc_allphysical_20150416' 'corumviapc_allphysical_20150416' 'dipviapc_allphysical_20150416' 'hprdviapc_allphysical_20150416' 'humancycviapc_allphysical_20150416' 'intactviapc_allphysical_20150416' 'pantherviapc_allphysical_20150416' 'reactomeviapc_allphysical_20150416' 'reconxviapc_allphysical_20150416' 'pc_allphysical_20150416' 'keggviapc_allphysical_20150416' 'ctd_dnaprot_20150415' 'intact_20150409' 'kinomescan_inhibfrac_20150120' 'klijn_rnaseq_20150415' 'kinativ_20150120' 'mirtarbase_20150415' 'klijn_cnv_20150415' 'klijn_mut_20150415' 'hugenavigator_20150415' 'gwasdb_20140908' 'gwasdb_20140908' 'corum_20150416' 'ctd_20150415' 'dbgap_20150415' 'gad_20150415' 'gad_highlevel_20150415' 'iuphar_20140923' 'iuphar_chemical_20140923' 'iuphar_protein_20140923' 'cclemut' 'omim20150115' 'nursa' 'cheanomerge' 'encode20150122' 'motifmap20150109' 'pcppiallphysical20150113' 'hpa_mrna_20150309' 'gtex_20150311' 'proteomicsdb_20150129' 'hpa_proteinihc_20150304' 'hpa_mrna_20150309' 'gtex_20150311' 'brainatlas_20150124' 'kea_20120719' 'gwascatalog_20150326' 'hpa_mrna_20150309' 'heiser' 'gdsc' 'cosmicmut' 'cosmiccnvnew' 'cclecnv' 'ccle' 'achilles_20150124' 'gtex_20150312' 'mgimpo20150209' 'interpro_20150324' 'jensendiseasecurated_20150202' 'jensentissuecurated_20150202' 'jensencompartmentcurated_20150202' 'jensendiseaseexpts_20150202' 'jensentissueexpts_20150202' 'jensencompartmentexpts_20150202' 'jensendiseasetextmining_20150202' 'jensentissuetextmining_20150202' 'jensencompartmenttextmining_20150202' 'gobp_20150331' 'gomf_20150331' 'gocc_20150331' 'reactome20141217' 'ncinat20141217' 'humancyc20141217' 'panther20141217' 'kegg20110818' 'biocarta20141217' 'wikipathways20141217' 'combinedpathways20141217'}';

attribute = {'tissuesample' 'tissuesample' 'tissue' 'tissue' 'gene' 'phenotype' 'drug' 'mirna' 'tf' 'gene' 'gene' 'gene' 'gene' 'gene' 'gene' 'gene' 'gene' 'gene' 'gene' 'gene' 'chemical' 'gene' 'chemical' 'cellline' 'chemical-cellline' 'mirna' 'cellline' 'cellline' 'disease' 'phenotype' 'disease' 'complex' 'disease' 'trait' 'disease' 'disease' 'ligand' 'ligand' 'ligand' 'cellline' 'disease' 'ip' 'tf' 'tf' 'tf' 'gene' 'tissuesample' 'tissuesample' 'tissue' 'tissue' 'tissue' 'tissue' 'tissue' 'substrate' 'phenotype' 'cellline' 'cellline' 'cellline' 'cellline' 'cellline' 'cellline' 'cellline' 'cellline' 'bestsnp' 'phenotype' 'domain' 'disease' 'tissue' 'compartment' 'disease' 'tissue' 'compartment' 'disease' 'tissue' 'compartment' 'bp' 'mf' 'cc' 'pathway' 'pathway' 'pathway' 'pathway' 'pathway' 'pathway' 'pathway' 'pathway'}';


genes = cell(numel(resource), 1);
counts = cell(numel(resource), 1);
cumulprob = cell(numel(resource), 1);
numgenes = zeros([numel(resource) 1]);
totalcounts = zeros([numel(resource) 1]);
meancount = zeros([numel(resource) 1]);
stdvcount = zeros([numel(resource) 1]);
mediancount = zeros([numel(resource) 1]);
rstdcount = zeros([numel(resource) 1]);
pct80count = zeros([numel(resource) 1]);
pct95count = zeros([numel(resource) 1]);
pct99count = zeros([numel(resource) 1]);

allgenes = {};

resourcelabel = cell(numel(resource), 1);

for i = 1:1:numel(resource)
    
    
    % get attribute table (connectivity matrix)
    gene_atb = load(['../' folder{i} '/gene_' attribute{i} '_' resource{i} '.mat'], '-mat');
    
    if ~isfield(gene_atb, 'cm') && isfield(gene_atb, 'lists')
        
        gene_atb.cm = lists2cm(gene_atb.lists);
        gene_atb = rmfield(gene_atb, 'lists');
        
    elseif ~isfield(gene_atb, 'cm') && isfield(gene_atb, 'edges')
        
        gene_atb.cm = edges2cm(gene_atb.edges);
        gene_atb = rmfield(gene_atb, 'edges');
        
    elseif issparse(gene_atb.cm.matrix)
        
        gene_atb.cm.matrix = full(gene_atb.cm.matrix);
        
    end
    
    
    % get stats
    genes{i} = upper(gene_atb.cm.term);
    counts{i} = sum(gene_atb.cm.matrix ~= 0, 2);
    numgenes(i) = numel(genes{i});
    totalcounts(i) = sum(counts{i});
    meancount(i) = mean(counts{i});
    stdvcount(i) = std(counts{i});
    mediancount(i) = median(counts{i});
    rstdcount(i) = 1.4826*mad(counts{i}, 1);
    pct80count(i) = quantile(counts{i}, 0.8);
    pct95count(i) = quantile(counts{i}, 0.95);
    pct99count(i) = quantile(counts{i}, 0.99);
    
    if numgenes(i) > 1000
        [f, x] = ksdensity(counts{i}, 'npoints', 1000, 'function', 'cdf');
        cumulprob{i} = interp1(x, f, counts{i});
    else
        cumulprob{i} = ksdensity(counts{i}, counts{i}, 'function', 'cdf');
    end
    
    
    % collect genes
    allgenes = union(allgenes, genes{i});
    
    
    % create label
    resourcelabel{i} = [attribute{i} '_' resource{i}];
    
    
    clear gene_atb;
    
    
end


% create counts matrix
gene_ds.cm = cminit(numel(allgenes), numel(resourcelabel), allgenes, 'GeneSym', [], [], [], [], resourcelabel, 'Dataset', [], [], [], [], []);
gene_ds.pm = gene_ds.cm;

for i = 1:1:gene_ds.cm.numentries
    
    [o1, o2] = ismember(gene_ds.cm.term, genes{i});
    o2(o2 == 0) = [];
    
    gene_ds.cm.matrix(o1,i) = counts{i}(o2);
    gene_ds.pm.matrix(o1,i) = cumulprob{i}(o2);
    
end


% try different normalizations
% frequency
gene_ds.fm = gene_ds.cm;
gene_ds.fm.matrix = gene_ds.cm.matrix./repmat(totalcounts', gene_ds.cm.numterms, 1);

% mean normalized
gene_ds.nm = gene_ds.cm;
gene_ds.nm.matrix = gene_ds.cm.matrix./repmat(meancount', gene_ds.cm.numterms, 1);
% gene_ds.nm.matrix = gene_ds.cm.matrix./repmat((totalcounts./numgenes)', gene_ds.cm.numterms, 1); % same thing

% 95%ile normalized
gene_ds.rnm = gene_ds.cm;
gene_ds.rnm.matrix = gene_ds.cm.matrix./repmat(pct95count', gene_ds.cm.numterms, 1);
gene_ds.rnm.matrix(gene_ds.rnm.matrix > 1) = 1;

% thresholded
gene_ds.tm = gene_ds.cm;
gene_ds.tm.matrix = double(gene_ds.cm.matrix > 0);

% log2 scaled
gene_ds.lm = gene_ds.cm;
gene_ds.lm.matrix = log2(gene_ds.cm.matrix);
gene_ds.lm.matrix(gene_ds.cm.matrix == 0) = 0;


% compute clustergrams
gene_ds.cm = cmcluster(gene_ds.cm, false);
close force all;

gene_ds.pm = cmcluster(gene_ds.pm, false);
close force all;

% gene_ds.fm = cmcluster(gene_ds.fm, false);
% close force all;
gene_ds.fm = conmatmap(gene_ds.fm, gene_ds.cm.term, gene_ds.cm.entry);

% gene_ds.nm = cmcluster(gene_ds.nm, false);
% close force all;
gene_ds.nm = conmatmap(gene_ds.nm, gene_ds.cm.term, gene_ds.cm.entry);

% gene_ds.rnm = cmcluster(gene_ds.rnm, false);
% close force all;
gene_ds.rnm = conmatmap(gene_ds.rnm, gene_ds.cm.term, gene_ds.cm.entry);

gene_ds.tm = cmcluster(gene_ds.tm, false);
close force all;

% gene_ds.lm = cmcluster(gene_ds.lm, false);
% close force all;
gene_ds.lm = conmatmap(gene_ds.lm, gene_ds.cm.term, gene_ds.cm.entry);


% view clustergrams
hmo = HeatMap(gene_ds.cm.matrix, 'Colormap', redbluecmap);
addTitle(hmo, 'counts');

hmo = HeatMap(gene_ds.pm.matrix, 'Colormap', redbluecmap);
addTitle(hmo, 'cumulative probabilities');

hmo = HeatMap(gene_ds.fm.matrix, 'Colormap', redbluecmap);
addTitle(hmo, 'frequencies');

hmo = HeatMap(gene_ds.nm.matrix, 'Colormap', redbluecmap);
addTitle(hmo, 'mean normalized counts');

hmo = HeatMap(gene_ds.rnm.matrix, 'Colormap', redbluecmap);
addTitle(hmo, '95%ile normalized counts');

hmo = HeatMap(gene_ds.tm.matrix, 'Colormap', redbluecmap);
addTitle(hmo, 'thresholded counts');

hmo = HeatMap(gene_ds.lm.matrix, 'Colormap', redbluecmap);
addTitle(hmo, 'log2 scaled counts');


% save data
save('../ReleasedData/gene_dataset_counts_20150609.mat', '-struct', 'gene_ds');


% write data
writecm('../ReleasedData/gene_dataset_counts_20150609', gene_ds.cm);
writecm('../ReleasedData/gene_dataset_cumulprobs_20150609', gene_ds.pm);
writecm('../ReleasedData/gene_dataset_frequencies_20150609', gene_ds.fm);
writecm('../ReleasedData/gene_dataset_meannormcounts_20150609', gene_ds.nm);
writecm('../ReleasedData/gene_dataset_95pctilenormcounts_20150609', gene_ds.rnm);
writecm('../ReleasedData/gene_dataset_threshcounts_20150609', gene_ds.tm);
writecm('../ReleasedData/gene_dataset_log2counts_20150609', gene_ds.lm);


