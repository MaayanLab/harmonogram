import os

ORIGIN = os.environ.get('ORIGIN', 'https://amp.pharm.mssm.edu')
ENTRY_POINT = os.environ.get('ENTRY_POINT', '/harmonogram')
ENRICHR_URL = os.environ.get('ENRICHR_URL', ORIGIN + '/Enrichr')
HARMONIZOME_URL = os.environ.get('HARMONIZOME_URL', ORIGIN + '/Harmonizome')
