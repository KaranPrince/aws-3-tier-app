pipeline {
    agent any
    environment {
        AWS_REGION = "us-east-1"
        WEB_DNS = "public-web-alb-339968302.us-east-1.elb.amazonaws.com"
        APP_DNS = "internal-intrnl-app-alb-812731221.us-east-1.elb.amazonaws.com"
        SSH_CRED = credentials('ec2-ssh-key')  // Jenkins SSH key credential ID
    }
    stages {
        stage('Deploy to Web Tier') {
            steps {
                sshagent([SSH_CRED]) {
                    sh '''
                        WEB_IP=$(aws ec2 describe-instances \
                            --region $AWS_REGION \
                            --filters "Name=tag:Name,Values=web-seed-1" \
                                      "Name=instance-state-name,Values=running" \
                            --query "Reservations[].Instances[].PrivateIpAddress" \
                            --output text)

                        echo "Deploying to Web Tier at $WEB_IP"
                        ssh -o StrictHostKeyChecking=no ec2-user@$WEB_IP '
                            cd /home/ec2-user/web-tier &&
                            git pull origin main &&
                            sudo systemctl restart nginx
                        '
                    '''
                }
            }
        }

        stage('Deploy to App Tier') {
            steps {
                sshagent([SSH_CRED]) {
                    sh '''
                        APP_IP=$(aws ec2 describe-instances \
                            --region $AWS_REGION \
                            --filters "Name=tag:Name,Values=app-seed-1" \
                                      "Name=instance-state-name,Values=running" \
                            --query "Reservations[].Instances[].PrivateIpAddress" \
                            --output text)

                        echo "Deploying to App Tier at $APP_IP"
                        ssh -o StrictHostKeyChecking=no ec2-user@$APP_IP '
                            cd /home/ec2-user/app-tier &&
                            git pull origin main &&
                            pm2 restart app-backend &&
                            pm2 save
                        '
                    '''
                }
            }
        }

        stage('Test Deployment') {
            steps {
                sh '''
                    echo "Testing Web Tier via $WEB_DNS"
                    curl -I http://$WEB_DNS

                    echo "Testing App Tier via $APP_DNS"
                    curl http://$APP_DNS/transaction || true
                '''
            }
        }
    }
}
