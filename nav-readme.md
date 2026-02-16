# Responsive Navigation Menu

A clean, modern, and fully responsive navigation menu with hamburger toggle for mobile devices.

## Features

- Responsive design that adapts to all screen sizes
- Hamburger menu toggle for mobile devices
- Smooth animations and transitions
- Accessible navigation
- Clean, modern styling
- Easy to customize

## Files Included

- `nav-component.html` - Complete HTML structure with demo content
- `nav-styles.css` - All CSS styles for the navigation
- `nav-script.js` - JavaScript for toggle functionality

## How to Use

### Option 1: Using the Complete HTML File
Simply open `nav-component.html` in your browser to see the navigation in action with demo content.

### Option 2: Integrating into Your Project

1. Copy the CSS styles from `nav-styles.css` into your main stylesheet
2. Add the HTML structure to your page:
```html
<nav class="navbar">
    <div class="nav-container">
        <div class="nav-logo">
            <a href="#" class="nav-logo-link">Your Logo</a>
        </div>
        <div class="nav-toggle" id="mobile-menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
        <ul class="nav-menu">
            <li class="nav-item">
                <a href="#" class="nav-link">Home</a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link">About</a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link">Services</a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link">Portfolio</a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link">Contact</a>
            </li>
        </ul>
    </div>
</nav>
```

3. Include the JavaScript file or copy the code to enable the toggle functionality:
```html
<script src="nav-script.js"></script>
```

## Customization

### Colors
Modify these variables in the CSS to change colors:
- Background: Change `background-color` in `.navbar`
- Text: Change `color` in `.nav-link`
- Hover: Change `background-color` in `.nav-link:hover::after`

### Breakpoints
The mobile breakpoint is set at 768px. You can adjust this in the media queries in the CSS file.

### Animation Speed
Change the `transition` values in the CSS to adjust animation speed.

## Browser Support

This navigation menu works in all modern browsers (Chrome, Firefox, Safari, Edge). For older browsers, consider adding vendor prefixes if needed.

## License

Feel free to use this component in personal or commercial projects.