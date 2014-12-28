To use GCE:

* You must have a Google GCE account, and have access to the GCE cloud console 
* Edit gce.yml as required (for example, to change the machine type or location)
* Edit bin/gce and update with your GCE credentials 
* Edit bin/frstack and set the environment variable to run against GCE instead of Vagrant

Run:
```
bin/gce  # Creates the GCE image
bin/frstack  # provision the image
```

