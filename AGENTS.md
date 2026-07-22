# DDS — Termux + Apache + MariaDB + PHP

Android local web server provisioning tool (formerly TAMP). Manages a full LAMP-like stack within Termux.

## Permanent Directives

- **Auto-load skills:** Whenever a task matches a skill's description, load that skill automatically without being asked. This is a permanent rule — do not wait for the user to request it.

## Tech Stack

| Concern | Choice |
|---|---|
| Runtime | Termux / Android |
| Web Server | Apache httpd (port 8080, SSL on 8443) |
| Database | MariaDB (MySQL-compatible) |
| Language | PHP (mod_php), Bash |
| CLI | Bash scripts (dds, setup, update) |
| Config | Apache httpd.conf, phpMyAdmin config.inc.php |
| SSL | OpenSSL self-signed cert |

## Installed Skills

### Infrastructure & Core
| Skill | Purpose |
|---|---|
| `php-pro` | PHP development patterns, best practices, security |
| `terminalskills-mysql` | MySQL/MariaDB database design, queries, optimization |
| `implementing-cli-patterns` | CLI tool architecture, argument parsing, output formatting |
| `linux-commands-guide` | Linux/Unix command reference, shell scripting |
| `bash-script-helper` | Bash scripting patterns, error handling, portability |
| `pandelisz-shell` | Shell command execution and automation patterns |
| `security-reviewer` | Security audit patterns for web servers and PHP apps |
| `skill-installation-workflow` | Workflow for finding and installing new skills |
| `project-bootstrap` | Project initialization and scaffolding patterns |
| `project-onboard` | Project onboarding and documentation patterns |

### Design Theory & UI/UX Core
| Skill | Purpose |
|---|---|
| `high-end-visual-design` | Premium agency-level visual design (Awwwards-tier) |
| `wondelai-refactoring-ui` | UI refactoring methodology, design scoring |
| `wondelai-top-design` | Seven Pillars of 10/10 award-winning design |
| `wondelai-ux-heuristics` | UX heuristics, usability evaluation framework |
| `wondelai-microinteractions` | Micro-interaction design, motion choreography |
| `wondelai-hooked-ux` | Hooked UX model (Trigger → Action → Reward → Investment) |
| `wondelai-design-everyday-things` | Design principles from Don Norman's classic |
| `wondelai-web-typography` | Web typography best practices, font pairing |
| `interface-design` | Interface design patterns, user flows, state analysis |
| `redesign-existing-projects` | Methodology for redesigning existing projects |

### Visual Style & Theming
| Skill | Purpose |
|---|---|
| `skeuomorphic-ui` | Skeuomorphic design with realistic textures and depth |
| `minimalist-ui` | Minimalist UI design principles and patterns |
| `industrial-brutalist-ui` | Industrial/brutalist aesthetic for bold interfaces |
| `solar-duotone-bold` | Solar duotone color scheme with bold contrast |
| `tech-green-dark-mode-modern` | Tech-green dark mode modern theme |
| `orange-clean-paper-saas` | Orange SaaS theme with clean paper aesthetic |
| `light-mode-paper-technical` | Light mode technical paper style |
| `split-layout-technical` | Split screen technical layout patterns |
| `mesh-gradient-dark-blue-clean` | Mesh gradient blue dark/clean aesthetic |
| `nested-container-clean-agency` | Agency-quality nested container layouts |
| `nested-container-frames` | Nested frame container patterns |
| `agency-grid-layout-minimal` | Minimal agency grid layout system |
| `high-contrast-skeuomorphic-clean` | High contrast skeuomorphic clean style |
| `technical-wireframe-info-layout` | Technical wireframe info layout |
| `image-first-grid-layout` | Image-first grid layout patterns |

### Web Technologies
| Skill | Purpose |
|---|---|
| `html` | HTML semantic structure, accessibility |
| `tailwindcss` | Tailwind CSS utility-first styling |
| `javascript` | JavaScript patterns, DOM manipulation |
| `landing-page` | Landing page design and development |
| `responsive-breakpoint-analyzer` | Responsive design breakpoint strategies |

## Project Structure

```
dds/
├── dds             # CLI entry point (start/stop/restart/status/update/uninstall)
├── setup           # One-shot installer
├── update          # Config re-apply after git pull
├── httpd.conf      # Apache configuration (port 8080)
├── httpd-ssl.conf  # Apache SSL configuration (port 8443)
├── config.inc.php  # phpMyAdmin configuration
├── .htaccess       # Directory index preference
├── LICENSE         # GPL v3
├── README.md       # Documentation
└── .openchat/
    └── skills/     # AI agent skills
