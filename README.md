<div align="center">

<img src="https://raw.githubusercontent.com/github/explore/main/topics/kubernetes/kubernetes.png" width="90" alt="Kubernetes"/>

# 🛒 Google Store — DevOps Project

### Micro-frontend E-Commerce Platform on **AWS EKS** with a **GitOps** delivery pipeline

<p>
<img src="https://img.shields.io/badge/AWS-EKS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white"/>
<img src="https://img.shields.io/badge/Kubernetes-1.29+-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white"/>
<img src="https://img.shields.io/badge/Docker-Containers-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
<img src="https://img.shields.io/badge/Argo%20CD-GitOps-EF7B4D?style=for-the-badge&logo=argo&logoColor=white"/>
<img src="https://img.shields.io/badge/GitHub%20Actions-CI%2FCD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white"/>
</p>
<p>
<img src="https://img.shields.io/badge/Flask-API-000000?style=for-the-badge&logo=flask&logoColor=white"/>
<img src="https://img.shields.io/badge/NGINX-Ingress-009639?style=for-the-badge&logo=nginx&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon%20RDS-MySQL-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon%20ECR-Registry-FF9900?style=for-the-badge&logo=amazonecs&logoColor=white"/>
<img src="https://img.shields.io/badge/HPA-Autoscaling-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white"/>
</p>

<p>
<img src="https://img.shields.io/badge/Services-10-success?style=flat-square"/>
<img src="https://img.shields.io/badge/Region-ap--northeast--1-orange?style=flat-square"/>
<img src="https://img.shields.io/badge/Namespace-google-blue?style=flat-square"/>
<img src="https://img.shields.io/badge/Sync-Automated%20%2B%20SelfHeal-EF7B4D?style=flat-square"/>
</p>

</div>

---

## 📑 Table of Contents

| # | Section | # | Section |
|:-:|:--|:-:|:--|
| 1 | [🎯 Overview](#-overview) | 7 | [🚀 Setup — Step by Step](#-setup--step-by-step) |
| 2 | [🧰 Tech Stack](#-tech-stack) | 8 | [🔐 GitHub Secrets](#-github-secrets-required) |
| 3 | [🏗 High-Level Architecture](#-high-level-architecture) | 9 | [🗄 Database Schema](#-database-schema) |
| 4 | [🔁 CI/CD Flow (Arrow-by-Arrow)](#-cicd-flow--arrow-by-arrow) | 10 | [🌐 Route Map](#-route-map) |
| 5 | [🌍 Request Flow (User → Pod → DB)](#-request-flow--user--pod--db) | 11 | [🛠 Troubleshooting](#-troubleshooting) |
| 6 | [📂 Repository Layout](#-repository-layout) | 12 | [⚠️ Security Notes](#-security-notes) |

---

## 🎯 Overview

A Google-Store style shopping site split into **9 independent micro-frontends** plus **1 Flask backend API**, each with its own Docker image, Deployment, Service and Horizontal Pod Autoscaler. Everything is deployed to a single **Amazon EKS** cluster, exposed through one **NGINX Ingress**, and continuously delivered by **GitHub Actions → Amazon ECR → Argo CD**.

| 🧩 What | 📊 Detail |
|:--|:--|
| 🖥 Micro-frontends | `main` · `electronics` · `phones` · `computers` · `earphones` · `googlemusic` · `googlepay` · `googleclothes` · `googlegrocery` |
| ⚙️ Backend | Flask REST API — `/api/signup`, `/api/login`, `/api/users` on port `5000` |
| 🗄 Database | Amazon RDS for MySQL — database `cloud`, table `users` |
| 📦 Registry | Amazon ECR — `shopping-site-<service>` repositories |
| 🚢 Delivery | GitHub Actions builds & pushes → patches image tag in Git → Argo CD syncs cluster |
| 📈 Scaling | HPA per service — `2 → 5` replicas at `50%` CPU |
| 🌏 Region | `ap-northeast-1` (Tokyo) · Cluster `google` · Namespace `google` |

---

## 🧰 Tech Stack

<div align="center">

| Layer | Technology | Icon |
|:--|:--|:-:|
| 🎨 Frontend | HTML5 · CSS3 · Vanilla JS served by NGINX Alpine | <img src="https://raw.githubusercontent.com/github/explore/main/topics/html/html.png" width="26"/> <img src="https://raw.githubusercontent.com/github/explore/main/topics/css/css.png" width="26"/> <img src="https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png" width="26"/> |
| ⚙️ Backend | Python 3.9 · Flask · PyMySQL · Werkzeug hashing | <img src="https://raw.githubusercontent.com/github/explore/main/topics/python/python.png" width="26"/> <img src="https://raw.githubusercontent.com/github/explore/main/topics/flask/flask.png" width="26"/> |
| 📦 Container | Docker multi-service images | <img src="https://raw.githubusercontent.com/github/explore/main/topics/docker/docker.png" width="26"/> |
| ☸️ Orchestration | Amazon EKS · eksctl · kubectl · HPA | <img src="https://raw.githubusercontent.com/github/explore/main/topics/kubernetes/kubernetes.png" width="26"/> |
| 🚦 Networking | NGINX Ingress Controller · AWS Load Balancer | <img src="https://raw.githubusercontent.com/github/explore/main/topics/nginx/nginx.png" width="26"/> |
| 🔄 CI | GitHub Actions (parallel matrix-style builds) | <img src="https://raw.githubusercontent.com/github/explore/main/topics/actions/actions.png" width="26"/> |
| 🎯 CD | Argo CD — automated sync, auto-prune, self-heal | <img src="https://argo-cd.readthedocs.io/en/stable/assets/logo.png" width="26"/> |
| 🗄 Data | Amazon RDS for MySQL / MariaDB client | <img src="https://raw.githubusercontent.com/github/explore/main/topics/mysql/mysql.png" width="26"/> |

</div>

---

## 🏗 High-Level Architecture

> Arrows show **direction of traffic and artifacts** — from developer commit all the way down to the database.

```mermaid
flowchart TD
    DEV["👨‍💻 Developer<br/>git push → main"]
    GHA["🔄 GitHub Actions<br/>cicd-argocd.yml"]
    ECR["📦 Amazon ECR<br/>shopping-site-*"]
    GIT["📝 Git Repo<br/>deployment.yml image tag"]
    ARGO["🎯 Argo CD<br/>automated · prune · self-heal"]

    DEV -->|"① commit"| GHA
    GHA -->|"② docker build + push"| ECR
    GHA -->|"③ sed patch + commit [skip ci]"| GIT
    GHA -->|"④ argocd app create/sync"| ARGO
    GIT -.->|"⑤ desired state polled"| ARGO

    subgraph EKS["☸️ Amazon EKS Cluster — google / ap-northeast-1"]
        direction TB
        ING["🚦 NGINX Ingress<br/>shop-ingress"]
        FE["🖥 9 Micro-Frontend Deployments — ns: google<br/>main · electronics · phones · computers · earphones<br/>googlemusic · googlepay · googleclothes · googlegrocery"]
        BE["⚙️ backend-deployment<br/>Flask :5000 × 2"]
        HPA["📈 HorizontalPodAutoscaler<br/>2 → 5 @ 50% CPU"]
    end

    ARGO ==>|"⑥ kubectl apply"| EKS
    ECR -.->|"⑦ image pull"| FE
    ECR -.->|"⑦ image pull"| BE

    USER["🌍 End User<br/>Browser"]
    ELB["⚖️ AWS Load Balancer"]
    RDS["🗄 Amazon RDS MySQL<br/>db: cloud · table: users"]

    USER -->|"⑧ HTTP"| ELB
    ELB -->|"⑨ :80"| ING
    ING -->|"⑩ path routing"| FE
    FE -->|"⑪ fetch /api/*"| BE
    BE -->|"⑫ PyMySQL :3306"| RDS
    HPA -.->|"scales"| FE

    style DEV fill:#24292e,color:#fff
    style GHA fill:#2088FF,color:#fff
    style ECR fill:#FF9900,color:#fff
    style ARGO fill:#EF7B4D,color:#fff
    style ING fill:#009639,color:#fff
    style BE fill:#000,color:#fff
    style RDS fill:#527FFF,color:#fff
    style USER fill:#4285F4,color:#fff
    style ELB fill:#8C4FFF,color:#fff
```

---

## 🔁 CI/CD Flow — Arrow by Arrow

Every step below maps 1:1 to a job step in [`.github/workflows/cicd-argocd.yml`](.github/workflows/cicd-argocd.yml).

```mermaid
sequenceDiagram
    autonumber
    actor Dev as 👨‍💻 Developer
    participant GH as 🐙 GitHub Repo
    participant CI as 🔄 GitHub Actions
    participant ECR as 📦 Amazon ECR
    participant AC as 🎯 Argo CD
    participant K8s as ☸️ EKS Cluster

    Dev->>GH: git push origin main
    GH->>CI: 🚀 trigger workflow (on push → main)
    CI->>CI: 🧾 checkout + 🔧 configure AWS creds
    CI->>ECR: 📦 ecr-login
    CI->>ECR: 🗑 batch-delete-image (clear old tags)
    CI->>ECR: 🛠 docker build + push (10 services in parallel)
    ECR-->>CI: ✅ image URIs @ $GITHUB_SHA
    CI->>GH: 🔄 sed patch deployment.yml + commit "[skip ci]"
    CI->>AC: 🔐 argocd login (--insecure)
    CI->>AC: 🔥 argocd app delete --cascade (parallel, polled)
    CI->>AC: ➕ argocd app create --upsert --sync-policy automated
    CI->>AC: 🚀 argocd app sync --force --prune
    AC->>GH: 👀 read desired state (manifests)
    AC->>K8s: ⚙️ apply Deployment / Service / HPA / Ingress
    K8s->>ECR: ⬇️ imagePullPolicy → pull image
    K8s-->>AC: 💚 pods Running
    AC-->>CI: ✅ argocd app wait --health
    CI-->>Dev: 📊 argocd app list — all Healthy & Synced
```

### 🔍 Pipeline stages at a glance

| # | Step | Icon | What happens | Direction |
|:-:|:--|:-:|:--|:--|
| 1 | Checkout | 🧾 | `actions/checkout@v4` with `GIT_PAT` | GitHub ➜ Runner |
| 2 | AWS auth | 🔧 | `configure-aws-credentials@v4` | Runner ➜ AWS STS |
| 3 | ECR login | 📦 | `amazon-ecr-login@v2` | Runner ➜ ECR |
| 4 | Clean + Build + Push | 🗑🛠 | Deletes old images, creates repo if missing, builds **10 images in parallel** | Runner ➜ ECR |
| 5 | Patch manifests | 🔄 | `sed` rewrites `image:` in every `deployment.yml` | Runner ➜ Git |
| 6 | Validate secrets | ✅ | Fails fast if Argo CD secrets missing | Runner (local) |
| 7 | Install Argo CD CLI | 🔽 | Downloads `argocd-linux-amd64` | GitHub ➜ Runner |
| 8 | Login | 🔐 | `argocd login $ARGOCD_SERVER` | Runner ➜ Argo CD |
| 9 | Delete old apps | 🔥 | `app delete --cascade` + poll until gone | Runner ➜ Argo CD ➜ EKS |
| 10 | Recreate apps | ➕ | `app create --upsert --auto-prune --self-heal` | Runner ➜ Argo CD |
| 11 | Sync + wait | 🚀 | `app sync --force --prune`, retry ×3, `app wait --health` | Argo CD ➜ EKS |
| 12 | Report | 📊 | `argocd app list` (runs `if: always()`) | Argo CD ➜ Logs |

> 💡 The `[skip ci]` marker on the auto-commit is what prevents the image-tag commit from re-triggering the workflow (infinite loop guard).

---

## 🌍 Request Flow — User → Pod → DB

```mermaid
flowchart LR
    U["🌍 Browser"] -->|"GET /"| LB["⚖️ ELB<br/>ingress-nginx"]
    LB -->|":80"| IG{"🚦 shop-ingress<br/>path match"}

    IG -->|"/"| S1["main-service ➜ main pods"]
    IG -->|"/electronics"| S2["electronics-service"]
    IG -->|"/phones"| S3["phones-service"]
    IG -->|"/computers"| S4["computers-service"]
    IG -->|"/earphones"| S5["earphones-service"]
    IG -->|"/googlemusic"| S6["googlemusic-service"]
    IG -->|"/googlepay"| S7["googlepay-service"]
    IG -->|"/googleclothes"| S8["googleclothes-service"]
    IG -->|"/googlegrocery"| S9["googlegrocery-service"]

    S1 & S2 & S3 & S7 -->|"fetch POST /api/login<br/>POST /api/signup"| BE["⚙️ backend-service :80 ➜ :5000"]
    BE -->|"PyMySQL SELECT / INSERT"| DB[("🗄 RDS MySQL<br/>cloud.users")]
    DB -->|"rows"| BE
    BE -->|"JSON 200 / 401"| S1

    style U fill:#4285F4,color:#fff
    style LB fill:#8C4FFF,color:#fff
    style IG fill:#009639,color:#fff
    style BE fill:#000,color:#fff
    style DB fill:#527FFF,color:#fff
```

Each frontend image ships its own `nginx.conf` with an `alias` block so the app works both at `/` and under its sub-path (e.g. `location /phones/ { alias /usr/share/nginx/html/; }`), plus a `301` redirect for the no-trailing-slash form.

---

## 📂 Repository Layout

```
Google-Store-DevOps-Project/
│
├── 📁 .github/workflows/
│   └── ⚙️  cicd-argocd.yml          # 🔄 Full CI/CD: build → push → patch → Argo CD sync
│
├── 📁 backend/                       # ⚙️ Flask API (Argo CD app: "backend")
│   ├── 🐍 app.py                     #    /api/signup · /api/login · /api/users
│   ├── 🐍 rds                        #    Extra receipts/orders API (RDS variant)
│   ├── 📋 requirements.txt           #    flask · flask_cors · pymysql
│   ├── 🐳 Dockerfile                 #    python:3.9-slim ➜ EXPOSE 5000
│   ├── ☸️  backend-deployment.yml     #    2 replicas, image patched by CI
│   └── ☸️  backend-service.yml        #    LoadBalancer 80 ➜ 5000
│
└── 📁 frontend/                      # 🖥 9 micro-frontends, one Argo CD app each
    ├── 🏠 main/                      #    ➜ /              (also holds ingress.yml)
    │   ├── 📄 index.html
    │   ├── 🐳 Dockerfile             #    nginx:alpine ➜ EXPOSE 80
    │   ├── ☸️  deployment.yml
    │   ├── ☸️  service.yml
    │   ├── 📈 autoscaler.yml         #    HPA 2 ➜ 5 @ 50% CPU
    │   └── 🚦 ingress.yml            #    ⭐ single Ingress for ALL routes
    ├── 💡 electronics/               #    ➜ /electronics
    ├── 📱 phones/                    #    ➜ /phones
    ├── 💻 computers/                 #    ➜ /computers
    ├── 🎧 earphones/                 #    ➜ /earphones
    ├── 🎵 googlemusic/               #    ➜ /googlemusic
    ├── 💳 googlepay/                 #    ➜ /googlepay
    ├── 👕 googleclothes/             #    ➜ /googleclothes
    └── 🛍 googlegrocery/             #    ➜ /googlegrocery
```

Every frontend folder follows the same contract: `index.html` + `style.css` + `script.js` + `nginx.conf` + `Dockerfile` + `deployment.yml` + `service.yml` + `autoscaler.yml`. Because Argo CD points at the folder, **adding a service = adding a folder** and registering it in the workflow env vars.

---

## 🚀 Setup — Step by Step

### 1️⃣ Prerequisites

```bash
# eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
eksctl version

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x ./kubectl && sudo mv ./kubectl /usr/local/bin/kubectl

# docker + git
sudo yum install -y docker git && sudo systemctl enable --now docker
```

### 2️⃣ Create the EKS cluster ☸️

```bash
eksctl create cluster \
  --name google \
  --region ap-northeast-1 \
  --node-type t3.medium \
  --nodes 2

aws eks update-kubeconfig --name google --region ap-northeast-1
kubectl get nodes
```

### 3️⃣ Namespace 📁

```bash
kubectl create namespace google
```

### 4️⃣ NGINX Ingress Controller 🚦

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

kubectl get pods -n ingress-nginx
kubectl get svc  -n ingress-nginx   # ⬅️ copy EXTERNAL-IP (the ELB DNS name)
```

### 5️⃣ Metrics Server 📈 (required for HPA)

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl top pods -n google
```

### 6️⃣ Argo CD 🎯

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# expose the UI/API
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
kubectl get svc -n argocd

# initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d && echo
```

### 7️⃣ Database client + schema 🗄

```bash
sudo yum update -y
sudo dnf install -y mariadb105

mysql -h <RDS_ENDPOINT> -u admin -p
```

### 8️⃣ Trigger the pipeline 🚀

```bash
git commit --allow-empty -m "🚀 trigger deploy"
git push origin main
```

Then watch it land:

```bash
argocd app list
kubectl get pods,svc,hpa,ingress -n google
```

---

## 🔐 GitHub Secrets Required

Set these in **Settings ➜ Secrets and variables ➜ Actions**.

| 🔑 Secret | 🎯 Used for | Referenced in |
|:--|:--|:--|
| `AWS_ACCOUNT_ID` | Builds the `ECR_REGISTRY` hostname | `env.ECR_REGISTRY` |
| `AWS_ACCESS_KEY_ID` | AWS auth for ECR push | Step 🔧 |
| `AWS_SECRET_ACCESS_KEY` | AWS auth for ECR push | Step 🔧 |
| `GIT_PAT` | Checkout + push the patched `deployment.yml` back to `main` | Steps 🧾 / 🔄 |
| `ARGOCD_SERVER` | Argo CD API endpoint (ELB DNS) | Step 🔐 |
| `ARGOCD_USERNAME` | Argo CD login (usually `admin`) | Step 🔐 |
| `ARGOCD_PASSWORD` | Argo CD login | Step 🔐 |

> 🛡 Recommended: replace the static IAM keys with **GitHub OIDC + an assumed IAM role** so no long-lived credentials live in the repo.

---

## 🗄 Database Schema

```sql
CREATE DATABASE IF NOT EXISTS cloud;
USE cloud;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(100) NOT NULL UNIQUE,
    full_name  VARCHAR(150) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,          -- werkzeug pbkdf2 hash
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 🔌 API Endpoints

| Method | Endpoint | Body | ✅ Success | ❌ Errors |
|:--|:--|:--|:--|:--|
| `POST` | `/api/signup` | `username`, `email`, `password` | `201` User registered | `400` missing fields / email exists · `500` |
| `POST` | `/api/login` | `email`, `password` | `200` + user object | `400` missing · `401` invalid · `500` |
| `GET`  | `/api/users` | — | `200` + user list | `500` |

Passwords are hashed with `generate_password_hash` and verified with `check_password_hash` — plaintext is never stored.

---

## 🌐 Route Map

All routes are served by the single `shop-ingress` defined in `frontend/main/ingress.yml`.

| 🎯 Path | ☸️ Service | 🖥 Micro-frontend | 🐳 ECR Repository |
|:--|:--|:--|:--|
| `/` | `main-service` | 🏠 main | `shopping-site-main` |
| `/electronics` | `electronics-service` | 💡 electronics | `shopping-site-electronics` |
| `/phones` | `phones-service` | 📱 phones | `shopping-site-phones` |
| `/computers` | `computers-service` | 💻 computers | `shopping-site-computers` |
| `/earphones` | `earphones-service` | 🎧 earphones | `shopping-site-earphones` |
| `/googlemusic` | `googlemusic-service` | 🎵 googlemusic | `shopping-site-googlemusic` |
| `/googlepay` · `/payment` | `googlepay-service` · `payment-service` | 💳 googlepay | `shopping-site-googlepay` |
| `/googleclothes` | `googleclothes-service` | 👕 googleclothes | `shopping-site-googleclothes` |
| `/googlegrocery` | `googlegrocery-service` | 🛍 googlegrocery | `shopping-site-googlegrocery` |
| `/api/*` | `backend-service` ➜ `:5000` | ⚙️ Flask API | `shopping-site-backend` |

> ⚠️ `ingress.yml` has an empty `host:` (matches any host) and a `/payment` rule pointing at a `payment-service` that no folder creates. Set the host to your ELB/domain and either add the service or drop that rule.

---

## 🛠 Troubleshooting

| 🚨 Symptom | 🔎 Likely cause | 🩹 Fix |
|:--|:--|:--|
| `ImagePullBackOff` | Nodes lack ECR pull permission, or the tag was deleted by the cleanup step | Attach `AmazonEC2ContainerRegistryReadOnly` to the node role · re-run the workflow |
| Ingress `ADDRESS` empty | Ingress controller LB still provisioning | `kubectl get svc -n ingress-nginx -w` |
| `404` on a sub-path | `nginx.conf` alias missing or Ingress rule absent | Check `location /<svc>/ { alias ... }` and `ingress.yml` |
| HPA shows `<unknown>` CPU | Metrics Server not installed, or no `resources.requests` set | Install Metrics Server; add CPU requests to containers |
| Argo CD app `OutOfSync` forever | Auto-sync raced with the manual sync | Workflow already calls `terminate-op` + retries ×3; check `argocd app get <app>` |
| Backend `500` on signup/login | RDS security group blocks the nodes, or wrong endpoint | Allow `3306` from the node security group; verify the host in `app.py` |
| Workflow loops endlessly | `[skip ci]` marker stripped from the auto-commit | Keep `[skip ci]` in the commit message |
| `argocd login` fails | `ARGOCD_SERVER` wrong or LB not reachable | `kubectl get svc argocd-server -n argocd` and update the secret |

Handy commands:

```bash
kubectl get pods -n google -o wide
kubectl logs -f deploy/backend-deployment -n google
kubectl describe ingress shop-ingress -n google
kubectl get hpa -n google
argocd app get main
argocd app history backend
```

---

## ⚠️ Security Notes

These are real findings in the current code — worth fixing before any non-demo use.

| 🔴 Severity | Finding | Recommendation |
|:-:|:--|:--|
| 🔴 High | `backend/app.py` hardcodes the RDS **host, user and password** in source | Move to a Kubernetes `Secret` / AWS Secrets Manager and read via env vars |
| 🔴 High | `backend/rds` also contains a hardcoded password | Same — externalise, then rotate the exposed credential |
| 🟠 Medium | `backend-service.yml` and every frontend `service.yml` are `type: LoadBalancer` | Switch to `ClusterIP` and route everything through the single Ingress — cheaper and smaller attack surface |
| 🟠 Medium | `/api/*` has **no authentication, rate limiting or session tokens** | Add JWT/session auth and rate limiting before exposing publicly |
| 🟠 Medium | `argocd login --insecure` and `--sync-policy automated --auto-prune` in CI | Use a proper TLS cert; scope auto-prune carefully |
| 🟡 Low | `CORS(app)` allows all origins | Restrict to the known frontend origin(s) |
| 🟡 Low | Pipeline deletes **all** ECR images every run — no rollback target | Keep the last N tags; use an ECR lifecycle policy instead |
| 🟡 Low | No `resources.requests/limits` on containers | Add them so HPA and the scheduler behave predictably |

---

## 📸 Reference Diagrams

<div align="center">

**Cluster Architecture**

<img src="https://i.ibb.co/6R7ZN38f/image.png" alt="Cluster Architecture" width="800"/>

**Workflow Diagram**

<img src="https://i.ibb.co/t9WR8c8/drawing.png" alt="Workflow Diagram" width="800"/>

</div>

---

<div align="center">

### ⭐ Built with Docker, Kubernetes, GitHub Actions & Argo CD on AWS

<img src="https://img.shields.io/badge/Made%20with-DevOps%20❤️-blue?style=for-the-badge"/>
<img src="https://img.shields.io/badge/GitOps-Argo%20CD-EF7B4D?style=for-the-badge&logo=argo&logoColor=white"/>

**[⬆ Back to top](#-google-store--devops-project)**

</div>
