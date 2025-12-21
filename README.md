# NCommerz E-commerce Platform

<p align="center">
<a href="https://github.com/alimworkzone/ncommerz"><img src="https://img.shields.io/github/stars/alimworkzone/ncommerz" alt="GitHub Stars"></a>
<a href="https://github.com/alimworkzone/ncommerz/releases"><img src="https://img.shields.io/github/v/release/alimworkzone/ncommerz" alt="Latest Release"></a>
<a href="https://github.com/alimworkzone/ncommerz/blob/main/LICENSE"><img src="https://img.shields.io/github/license/alimworkzone/ncommerz" alt="License"></a>
</p>

## About NCommerz

NCommerz is a modern, full-featured e-commerce platform built with Laravel and React. It provides everything you need to start your online business with a professional, responsive design and powerful admin panel.

### ✨ Key Features

- 🛍️ **Complete E-commerce Solution** - Product catalog, shopping cart, order management
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI/UX** - Built with React and Tailwind CSS
- 👨‍💼 **Powerful Admin Panel** - Manage products, orders, customers, and settings
- 📊 **Sales Analytics** - Real-time dashboard with charts and statistics
- 🖼️ **Image Management** - Easy upload and management of product images
- 📧 **Order Tracking** - Customer order tracking system
- 💳 **Multiple Payment Methods** - Cash on Delivery, bKash, Nagad
- 🏷️ **Category Management** - Organize products with categories
- ⚙️ **Dynamic Settings** - Configure store settings from admin panel
- 📱 **WhatsApp Integration** - Direct customer communication
- 🧾 **Invoice System** - Generate and manage invoices
- 🔌 **Built-in n8n API Integration** - Seamless workflow automation and third-party integrations

---

## 🚀 Quick Installation Guide

### Recommended Hosting Providers

For the best experience, we recommend **Hostinger** - reliable, fast, and affordable hosting:

**🎯 [Get Hostinger Hosting (Special Discount)](https://hostinger.com?REFERRALCODE=alimbd1234)**
- ✅ **Shared Hosting**: Starting from $1.99/month
- ✅ **VPS Hosting**: Starting from $3.99/month  
- ✅ **Free SSL Certificate**
- ✅ **24/7 Support**
- ✅ **99.9% Uptime Guarantee**

---

## 📋 Requirements

- **PHP**: 8.1 or higher
- **MySQL**: 5.7 or higher
- **Node.js**: 16.x or higher
- **Composer**: Latest version
- **Web Server**: Apache/Nginx

---

## 🔧 Installation Methods

### Method 1: Shared Hosting Installation

#### Step 1: Download & Upload
```bash
# Download the project
git clone https://github.com/alimworkzone/ncommerz.git
cd ncommerz

# Or download ZIP from GitHub and extract
```

#### Step 2: Upload to Hosting
1. **Upload files** to your hosting's `public_html` folder
2. **Move public folder contents** to `public_html` root
3. **Update paths** in `public_html/index.php`:
   ```php
   require __DIR__.'/bootstrap/app.php';
   ```

#### Step 3: Database Setup
1. **Create MySQL database** in cPanel/hosting panel
2. **Import database** (if you have a backup)
3. **Configure `.env` file**:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

#### Step 4: Install Dependencies
```bash
# Install PHP dependencies
composer install --optimize-autoloader --no-dev

# Install Node.js dependencies
npm install

# Build assets
npm run build
```

#### Step 5: Configure Application
```bash
# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed

# Create storage link
php artisan storage:link

# Clear cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

### Method 2: VPS Installation (Ubuntu/CentOS)

#### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install nginx mysql-server php8.1-fpm php8.1-mysql php8.1-xml php8.1-gd php8.1-curl php8.1-zip php8.1-mbstring unzip curl -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

#### Step 2: Clone Project
```bash
# Clone to web directory
cd /var/www
sudo git clone https://github.com/alimworkzone/ncommerz.git
sudo chown -R www-data:www-data ncommerz
cd ncommerz
```

#### Step 3: Install Dependencies
```bash
# Install PHP dependencies
composer install --optimize-autoloader --no-dev

# Install Node dependencies
npm install

# Build production assets
npm run build
```

#### Step 4: Database Configuration
```bash
# Create database
sudo mysql -u root -p
CREATE DATABASE ncommerz;
CREATE USER 'ncommerz_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON ncommerz.* TO 'ncommerz_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 5: Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Edit configuration
nano .env
```

Update these values in `.env`:
```env
APP_NAME="Your Store Name"
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ncommerz
DB_USERNAME=ncommerz_user
DB_PASSWORD=strong_password
```

#### Step 6: Application Setup
```bash
# Generate key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Create storage link
php artisan storage:link

# Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

#### Step 7: Nginx Configuration
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/ncommerz
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/ncommerz/public;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ncommerz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔐 Default Login Credentials

After installation, use these credentials:

**Admin Panel**: `yourdomain.com/admin`
- **Email**: `admin@ncommerz.com`
- **Password**: `password`

**Customer Account**:
- **Email**: `customer@ncommerz.com`
- **Password**: `password`

> ⚠️ **Important**: Change these passwords immediately after first login!

---

## ⚙️ Configuration

### Admin Settings
1. Go to **Admin Panel** → **Settings**
2. Configure:
   - Store name and description
   - Logo upload
   - Support phone and email
   - Payment methods (bKash, Nagad)
   - Delivery charges

### Payment Setup
- **Cash on Delivery**: Enabled by default
- **bKash**: Add merchant number and instructions
- **Nagad**: Add merchant number and instructions

---

## 📱 Features Overview

### Customer Features
- Browse products by categories
- Product search and filtering
- Shopping cart functionality
- Order placement and tracking
- WhatsApp support integration
- Responsive mobile design

### Admin Features
- Dashboard with sales analytics
- Product management (CRUD)
- Category management
- Order management and status updates
- Customer management
- Invoice generation
- Settings configuration
- Image upload and management

---

## 🛠️ Troubleshooting

### Common Issues

**1. Permission Errors**
```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

**2. Storage Link Issues**
```bash
php artisan storage:link
```

**3. Cache Issues**
```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

**4. Database Connection**
- Check `.env` database credentials
- Ensure MySQL service is running
- Verify database exists

---

## 🔄 Updates

To update NCommerz:

```bash
# Backup your database first!
git pull origin main
composer install --optimize-autoloader --no-dev
npm install && npm run build
php artisan migrate
php artisan config:cache
```

---

## 📞 Support

- **GitHub Issues**: [Report bugs](https://github.com/alimworkzone/ncommerz/issues)
- **Documentation**: [Wiki](https://github.com/alimworkzone/ncommerz/wiki)
- **Developer**: Abdul Alim

---

## 📄 License

NCommerz is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

## 👨‍💻 Developer

**Abdul Alim**
- GitHub: [@alimworkzone](https://github.com/alimworkzone)
- Project: [NCommerz](https://github.com/alimworkzone/ncommerz)

---

## 🌟 Show Your Support

If you find NCommerz helpful, please give it a ⭐ on GitHub!

**[⭐ Star this repository](https://github.com/alimworkzone/ncommerz)**

---

*Built with ❤️ using Laravel & React*
