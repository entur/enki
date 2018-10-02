library 'entur-jobs'

node {
    try {
        def version = "v${env.BUILD_NUMBER}"
        def imageTag = "${env.BRANCH_NAME}-${version}"

        stage("Checkout source") {
            checkout scm
            sh "git clean -fd"
        }

        stage("Build") {
            sh "npm install"
            sh "GENERATE_SOURCEMAP=true IMAGE_TAG=${imageTag} npm run-script build"
            sh "npm --prefix ./server install ./server"
        }

        stage("App test") {
            withEnv(["CI=true"]) {
                sh "npm run-script test"
            }
        }

        stage("Server test") {
            withEnv(["DRY_RUN=dry"]) {
                sh "node server/src/server.js"
            }
        }

        if (env.BRANCH_NAME == "master") {
            def appName = "order-transport"

            stage("Build docker image and push to GCR") {
                def imageName = "eu.gcr.io/entur-1287/${appName}"
                def dockerTag = "${imageName}:${imageTag}"
                sh "docker build --tag=${dockerTag} --build-arg BUILD_DATE=${new Date().format('yyyy.MM.dd')} ."
                sh "gcloud docker -a"
                sh "docker push ${dockerTag}"
                sh "docker rmi -f \$(docker images | grep ${imageName} | awk '{print \$3}') || true"
            }

            if(env.BRANCH_NAME == "master") {
                stage("Git tag") {
                    sh "git tag ${version}"
                    sh "git push origin ${version}"
                }

                stage("Upload source maps to sentry") {
                    sh "chmod +x ./scripts/uploadSourceMaps.sh"
                    sh "./scripts/uploadSourceMaps.sh ${imageTag}"
                }
            }

            stage("Update chart") {
                updateHelmChart{chartFolderName = "order-transport-chart"}
            }
        }
    } catch(err) {
        println "Build failed: ${err}"
        sh "exit 1"
    }
}
