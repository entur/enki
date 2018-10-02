#!/bin/bash -e

environment=$1
version=$2
mode=${3:-upgrade}

application=order-transport
release_name=$application-$environment
chart=./$application-chart

if [ -z "$environment" -o -z "$version" ] || [[ ! "$1" =~ ^(dev|staging|prod)$ ]] || [[ ! "$mode" =~ ^(upgrade|reinstall)$ ]]
then
    echo "The proper usage is ./deploy.sh {environment} {version} {?mode}"
    echo "Valid values for environment: dev/dev1/dev2/staging/prod"
    echo "Valid modes for mode upgrade/reinstall (upgrade is default)"
    exit 1
fi

select_kube_cluster() {
    gcloud container clusters get-credentials $1 --zone europe-west1-d
}

select_devstage_cluster() {
    select_kube_cluster "entur"
}

select_prod_cluster() {
    select_kube_cluster "entur-prod"
}

dev_env()
{
    kubernetes_namespace=dev
    env_values=
    select_devstage_cluster
}

staging_env()
{
    kubernetes_namespace=staging
    env_values="--set authServerUrl=https://kc-stage.devstage.entur.io/auth"
    select_devstage_cluster
}

prod_env()
{
    kubernetes_namespace=production
    env_values="--set isProd=true --set domain=portal.entur.org --set authServerUrl=https://auth.entur.org/auth"
    gcloud container clusters get-credentials entur-prod --zone europe-west1-d
    select_prod_cluster
}

case $environment in
    dev)
    dev_env
    ;;
    staging)
    staging_env
    ;;
    prod)
    prod_env
    ;;
esac

if [ "$mode" == "reinstall" ]; then
    echo "Reinstalling $application $version to $environment"
    helm delete --purge $release_name || true
    helm install --namespace $kubernetes_namespace --name $release_name  --set imageTag=$version --set environment=$environment $env_values $chart || true
else
    echo "Upgrading $application to $version at $environment"
    helm upgrade --namespace $kubernetes_namespace --set imageTag=$version --set environment=$environment $env_values $release_name $chart || true
fi

if [ "$environment" == "prod" ]; then
    select_devstage_cluster
fi