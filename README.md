![Art Institute of Chicago](https://raw.githubusercontent.com/Art-Institute-of-Chicago/template/master/aic-logo.gif)


# Data Dashboard
> A dashboard and debugger for our data hub

This dashboard is part of a broader project meant to aggregate and inter-
connect data from AIC's various systems into a single API. It will offer a
GUI for exploring aggregated data, visualizations, and monitoring 
capabilities.

This dashboard was built in-house and is maintained by in-house developers. 
It is planned to go to production in 2017.


## Overview

This dashboard is part of a larger project at the Art Institute of Chicago 
to build a data hub for all of our published data--a single point that our 
forthcoming website and future products can access all the data they might 
be interested in in a simple, normalized, RESTful way.


## Requirements

We've run this on our local machines with the following software as minimums:

* NPM


## Installing

To get started with this project, use the following commands:

```shell
# Clone the repo to your computer
git clone https://github.com/art-institute-of-chicago/data-dashboard.git

# Enter the folder that was created by the clone
cd data-dashboard

# Install all the project's NPM dependencies
npm install
```


## Contributing

We encourage your contributions. Please fork this repository and make your changes in a separate branch. You can use [git-flow](https://github.com/nvie/gitflow) to make this process easier.

```bash
# Clone the repo to your computer
git clone git@github.com:your-github-account/data-service-collections.git

# Enter the folder that was created by the clone
cd data-aggregator

# Run the installs
composer install

# Start a feature branch
git flow start feature yourinitials-good-description-issuenumberifapplicable

# ... make some changes, commit your code

# Push your branch to GitHub
git push origin yourinitials-good-description-issuenumberifapplicable
```

Then on github.com, create a Pull Request to merge your changes into our
`develop` branch.

This project is released with a Contributor Code of Conduct. By 
participating in this project you agree to abide by its 
[terms](CODE_OF_CONDUCT.md).

We also welcome bug reports and questions under GitHub's [Issues](issues).


## Licensing

This project is licensed under the [GNU Affero General Public License
Version 3](LICENSE).
