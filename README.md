fast.ai CLI
===========

Setup a deep learning machine in the cloud (NVIDIA K80 GPU & 11 GB RAM).

## Get Started

Register for an [AWS account](https://aws.amazon.com), if you haven't already; [add a user](https://console.aws.amazon.com/iam/home?region=eu-west-1#/home), [create a key pair](https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#KeyPairs:sort=keyName) & configure AWS:

```sh
pip install awscli
# use "eu-west-1" or "us-west-2" for region (closest to you)
# use "json" for output format
aws configure
```

If you don't have a line of credit with AWS you'll need to manually request a limit increase for on-demand `p2.xlarge` instances [here](https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Limits:). Enter `1` for the new limit value & `fast.ai machine learning` for the use case description. Don't continue until the request is approved (should be within 24 hours).

Create & configure an instance:

```sh
npm install -g fast-ai-cli
fa setup
```

The easiest way to start coding is with a [Jupyter Notebook](http://jupyter.org/).

```sh
fa ssh
# on ec2 instance
jupyter notebook
```

Run `fa open` in another terminal or, in your browser, go to `[YOUR_INSTANCE_URL]:8888`. The default password is `dl_course`.

Create a new notebbok & have fun! :phone: :princess: :horse: :smile:

**IMPORTANT:** Run `fa stop` when your done (you'll be charged $0.90/hour otherwise)

## Commands

* `fa setup` - Creates an internet-accessible network & instance
* `fa stop` - Stop your instance
* `fa start` - Restart your instance
* `fa teardown` - Delete your network & instance
* `fa open` - Open Jupyter Notebook in your browser (if it's running)
* `fa details` - Print details about your instance
* `fa ssh` - Connect to your instance

## Options

##### All

* `--file` - JSON file for instance details

##### `setup` only

* `--region` - `eu-west-1` or `us-west-2`
* `--instance` - `p2` (has GPU) or `t2` (CPU only)
* `--name` - for tags, defaults to `fast-ai`
* `--ami` - advanced usage only
* `--key` - key location
* `--key-name` - key name on amazon (key filename by default)

## Todo

* Spot instances (see http://wiki.fast.ai/index.php/AWS_Spot_instances)
* Stop instances automatically (after 1 hour w/ no interaction & average CPU below 5%)
* `fa start` creates an instance if none exists
* Use tags instead of file to lookup details
* Set initial password with an option
