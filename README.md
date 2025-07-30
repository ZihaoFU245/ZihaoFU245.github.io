# Zihao Fu - Personal Portfolio

A modern, responsive portfolio website built with Jekyll and Tailwind CSS, featuring a clean grey-blue theme and optimized for performance and accessibility.

## 🚀 Features

- **Modern Design**: Clean, professional layout with a sophisticated grey-blue color scheme
- **Responsive**: Fully responsive design that works on all devices
- **Fast Loading**: Optimized for performance with minimal dependencies
- **SEO Optimized**: Includes meta tags, structured data, and sitemap
- **Accessible**: WCAG compliant with proper contrast ratios and semantic HTML
- **Easy to Customize**: Single-source data management through YAML files

## 🛠 Tech Stack

- **Jekyll** - Static site generator
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icons
- **GitHub Pages** - Hosting and deployment
- **GitHub Actions** - CI/CD pipeline

## 📁 Project Structure

```
my-website/
├─ .github/
│  └─ workflows/pages.yml      # CI/CD to Pages
├─ _data/                      # YAML data files
│  ├─ resume.yml               # Resume data
│  └─ projects.yml             # Project information
├─ _includes/                  # Reusable components
│  ├─ navigation.html
│  ├─ footer.html
│  └─ project-card.html
├─ _layouts/                   # Page templates
│  ├─ base.html
│  └─ default.html
├─ assets/
│  └─ css/
│     ├─ input.css             # Tailwind source
│     └─ main.css              # Compiled CSS
├─ index.html                  # Home page
├─ projects.html               # Projects showcase
├─ resume.html                 # Detailed resume
└─ Configuration files
```

## 🎨 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| --bg | #0F172A | Page background |
| --panel | #1F2937 | Cards/navigation |
| --accent | #1E3A8A | Headings/links |
| --accent-light | #60A5FA | Hover states |
| --text | #E5E7EB | Body text |

## 🚀 Getting Started

### Prerequisites

- Ruby (3.1+)
- Node.js (18+)
- Bundler gem

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZihaoFU245/ZihaoFU245.github.io.git
   cd ZihaoFU245.github.io
   ```

2. **Install dependencies**
   ```bash
   # Install Ruby dependencies
   bundle install
   
   # Install Node.js dependencies
   npm install
   ```

3. **Build Tailwind CSS**
   ```bash
   npm run build
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   bundle exec jekyll serve --livereload
   ```

5. **Open in browser**
   Navigate to `http://localhost:4000`

### Building for Production

```bash
# Build CSS
npm run build

# Build Jekyll site
bundle exec jekyll build
```

## 📝 Customization

### Personal Information

Edit `_data/resume.yml` to update:
- Contact information
- Education details
- Skills and technologies
- Work experience
- Awards and certifications

### Projects

Edit `_data/projects.yml` to add or modify projects:
- Project names and descriptions
- Technologies used
- Links to repositories and demos
- Featured status

### Styling

- Colors: Update `tailwind.config.js` for theme colors
- Fonts: Modify font imports in `assets/css/input.css`
- Components: Customize classes in the CSS file

### Content

- **Home Page**: Edit `index.html`
- **Resume Page**: Modify `resume.html`
- **Projects Page**: Update `projects.html`

## 🔧 Development Commands

```bash
# Watch for CSS changes
npm run watch

# Build production CSS
npm run build

# Start Jekyll with live reload
npm run dev

# Build for production
bundle exec jekyll build
```

## 🚀 Deployment

The site automatically deploys to GitHub Pages when you push to the `main` branch. The GitHub Actions workflow:

1. Installs dependencies
2. Builds Tailwind CSS
3. Builds Jekyll site
4. Deploys to GitHub Pages

### Manual Deployment

```bash
# Build everything
npm run build
bundle exec jekyll build

# Push to main branch
git add .
git commit -m "Update content"
git push origin main
```

## 📋 TODO

- [ ] Add your actual contact information
- [ ] Replace placeholder project links
- [ ] Add high-res profile photo
- [ ] Set up Formspree for contact form
- [ ] Add project screenshots/GIFs
- [ ] Create PDF resume
- [ ] Add custom domain (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Site**: [ZihaoFU245.github.io](https://zihaofу245.github.io)
- **Repository**: [GitHub](https://github.com/ZihaoFU245/ZihaoFU245.github.io)

---

Built with ❤️ using Jekyll and Tailwind CSS
