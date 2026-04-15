# CITRICA UI TOOLKIT

Citrica UI Toolkit is a React component library built on top of HeroUI components, providing a custom design system wrapper. The library is built with TypeScript and bundled using tsup for distribution.

## Installation

```bash
npm install citrica-ui-toolkit
```

## Architecture

Components follow Atomic Design principles:
- **Atoms**: Basic building blocks (Button, Input, Select, Icon, Card, Grid, Text)
- **Molecules**: Compositions of atoms (Modal, Carousel)
- **Organisms**: Complex UI sections (Footer, Header, Sidebar)

---

## Components Documentation

### ATOMS

#### Button

Interactive button component with multiple variants and admin mode support.

**Import:**
```typescript
import { Button } from 'citrica-ui-toolkit';
```

**Props:**
- `label?: string` - Button text label
- `children?: React.ReactNode` - Custom content (overrides label)
- `variant?: "primary" | "secondary" | "flat" | "success" | "warning" | "danger"` - Visual style (default: "primary")
- `textVariant?: "label" | "body" | "title" | "display" | "headline" | "subtitle"` - Text typography variant (default: "label")
- `size?: "sm" | "md" | "lg"` - Button size (default: "md")
- `type?: "button" | "submit" | "reset"` - HTML button type (default: "button")
- `isDisabled?: boolean` - Disable button (default: false)
- `isIconOnly?: boolean` - Button with only icon, no text
- `isAdmin?: boolean` - Use admin theme colors (default: false)
- `isLoading?: boolean` - Show loading state
- `startContent?: React.ReactNode` - Content before label
- `endContent?: React.ReactNode` - Content after label
- `fullWidth?: boolean` - Expand to full width
- `className?: string` - Additional CSS classes
- `onPress?: () => void` - Click handler

**Usage:**
```tsx
// Basic button
<Button label="Click me" variant="primary" />

// Admin mode button
<Button label="Admin Action" variant="primary" isAdmin={true} />

// Button with icon content
<Button label="Save" startContent={<Icon name="Save" />} />

// Loading button
<Button label="Loading..." isLoading={true} />
```

**CSS Classes Applied:**
- `btn-citrica-ui` or `btn-citrica-ui-admin`
- `btn-{variant}` or `btn-{variant}-admin`

---

#### Input

Text input field with icon support and validation capabilities.

**Import:**
```typescript
import { Input } from 'citrica-ui-toolkit';
```

**Props:**
- `label?: string` - Input label
- `placeholder?: string` - Placeholder text
- `value?: string` - Controlled value
- `defaultValue?: string` - Uncontrolled default value
- `onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void` - Change handler
- `onValueChange?: (value: string) => void` - Value change handler (string only)
- `name?: string` - Input name for forms
- `type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'datetime-local' | 'time'` - Input type (default: 'text')
- `variant?: 'primary' | 'secondary' | 'flat' | 'bordered' | 'faded' | 'underlined'` - Visual style (default: 'primary')
- `size?: 'sm' | 'md' | 'lg'` - Input size (default: 'md')
- `radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'` - Border radius (default: 'md')
- `required?: boolean` - Mark as required
- `disabled?: boolean` - Disable input
- `readOnly?: boolean` - Make read-only
- `isInvalid?: boolean` - Show invalid state
- `errorMessage?: string` - Error message to display
- `description?: string` - Helper text
- `startIcon?: IconName` - Lucide icon at start (e.g., "Mail", "Lock")
- `endIcon?: IconName` - Lucide icon at end
- `startContent?: React.ReactNode` - Custom content at start
- `endContent?: React.ReactNode` - Custom content at end
- `iconSize?: number` - Icon size in pixels (default: 20)
- `iconColor?: string` - Icon color
- `fullWidth?: boolean` - Full width (default: true)
- `clearable?: boolean` - Show clear button
- `autoFocus?: boolean` - Auto focus on mount
- `maxLength?: number` - Maximum characters
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
// Basic input
<Input label="Email" type="email" placeholder="Enter your email" />

// Input with icon
<Input
  label="Password"
  type="password"
  startIcon="Lock"
  variant="primary"
/>

// Input with validation
<Input
  label="Username"
  isInvalid={true}
  errorMessage="Username is required"
/>

// Controlled input
<Input
  value={value}
  onValueChange={(val) => setValue(val)}
/>
```

**CSS Classes Applied:**
- `input-citrica-ui`
- `input-primary` or `input-secondary` (for custom variants)

**Notes:**
- Uses `forwardRef` for ref forwarding (compatible with react-hook-form)
- Custom variants (primary/secondary) internally map to HeroUI's "bordered" variant

---

#### Select

Dropdown select component with option items.

**Import:**
```typescript
import { Select, type SelectOption } from 'citrica-ui-toolkit';
```

**Props:**
- `label?: string` - Select label
- `placeholder?: string` - Placeholder text
- `selectedKeys?: string[]` - Controlled selected keys
- `defaultSelectedKeys?: string[]` - Default selected keys
- `onSelectionChange?: (keys: any) => void` - Selection change handler
- `name?: string` - Input name for forms
- `variant?: 'primary' | 'secondary' | 'flat' | 'bordered' | 'faded' | 'underlined'` - Visual style (default: 'primary')
- `size?: 'sm' | 'md' | 'lg'` - Size (default: 'md')
- `radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'` - Border radius (default: 'md')
- `required?: boolean` - Mark as required
- `disabled?: boolean` - Disable select
- `isInvalid?: boolean` - Show invalid state
- `errorMessage?: string` - Error message
- `description?: string` - Helper text
- `startIcon?: IconName` - Icon at start
- `endIcon?: IconName` - Icon at end
- `startContent?: React.ReactNode` - Custom content at start
- `endContent?: React.ReactNode` - Custom content at end
- `iconSize?: number` - Icon size (default: 20)
- `iconColor?: string` - Icon color
- `fullWidth?: boolean` - Full width (default: true)
- `options: SelectOption[]` - Array of options (required)
- `renderValue?: (items: SelectedItem[]) => React.ReactNode` - Custom render for selected value
- `className?: string` - Additional CSS classes

**SelectOption Interface:**
```typescript
interface SelectOption {
  value: string;        // Option value
  label: string;        // Display text
  description?: string; // Optional description
  startContent?: React.ReactNode; // Content at start
  endContent?: React.ReactNode;   // Content at end
}
```

**Usage:**
```tsx
const options = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2", description: "Description for option 2" },
  { value: "3", label: "Option 3" }
];

// Basic select
<Select
  label="Choose option"
  placeholder="Select an option"
  options={options}
/>

// Controlled select
<Select
  selectedKeys={[selectedValue]}
  onSelectionChange={(keys) => setSelectedValue(Array.from(keys)[0])}
  options={options}
/>

// Select with custom render
<Select
  options={options}
  renderValue={(items) => (
    <div>
      {items.map(item => item.label).join(", ")}
    </div>
  )}
/>
```

**CSS Classes Applied:**
- `select-citrica-ui`
- `select-primary` or `select-secondary`
- `select-item-citrica-ui` (on option items)

---

#### Autocomplete

Searchable autocomplete/combobox component with filtering.

**Import:**
```typescript
import { Autocomplete, type AutocompleteOption } from 'citrica-ui-toolkit';
```

**Props:**
- `label?: string` - Field label
- `placeholder?: string` - Placeholder text
- `selectedKey?: string | null` - Controlled selected key
- `defaultSelectedKey?: string` - Default selected key
- `inputValue?: string` - Controlled input value
- `defaultInputValue?: string` - Default input value
- `onSelectionChange?: (key: string | null) => void` - Selection handler
- `onInputChange?: (value: string) => void` - Input change handler
- `onClear?: () => void` - Clear handler
- `name?: string` - Input name
- `variant?: 'primary' | 'secondary' | 'flat' | 'bordered' | 'faded' | 'underlined'` - Style (default: 'primary')
- `size?: 'sm' | 'md' | 'lg'` - Size (default: 'md')
- `radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'` - Border radius (default: 'md')
- `required?: boolean` - Required field
- `disabled?: boolean` - Disable component
- `isInvalid?: boolean` - Invalid state
- `isReadOnly?: boolean` - Read-only mode
- `errorMessage?: string` - Error message
- `description?: string` - Helper text
- `startIcon?: IconName` - Icon at start
- `endIcon?: IconName` - Icon at end
- `iconSize?: number` - Icon size (default: 20)
- `iconColor?: string` - Icon color
- `fullWidth?: boolean` - Full width (default: true)
- `options: AutocompleteOption[]` - Options array (required)
- `allowsCustomValue?: boolean` - Allow custom values (default: false)
- `isClearable?: boolean` - Show clear button (default: true)
- `menuTrigger?: 'focus' | 'input' | 'manual'` - When to open menu (default: 'focus')
- `labelPlacement?: 'inside' | 'outside' | 'outside-left'` - Label position (default: 'inside')
- `disabledKeys?: string[]` - Array of disabled keys
- `maxListboxHeight?: number` - Max height of dropdown
- `isVirtualized?: boolean` - Enable virtualization for large lists
- `className?: string` - Additional CSS classes

**AutocompleteOption Interface:**
```typescript
interface AutocompleteOption {
  value: string;
  label: string;
  description?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}
```

**Usage:**
```tsx
const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" }
];

// Basic autocomplete
<Autocomplete
  label="Choose fruit"
  placeholder="Search fruits..."
  options={options}
/>

// Controlled autocomplete
<Autocomplete
  selectedKey={selected}
  onSelectionChange={setSelected}
  inputValue={input}
  onInputChange={setInput}
  options={options}
/>

// With custom values
<Autocomplete
  options={options}
  allowsCustomValue={true}
  placeholder="Type or select..."
/>
```

**CSS Classes Applied:**
- `autocomplete-citrica-ui`
- `autocomplete-primary` or `autocomplete-secondary`
- `autocomplete-item-citrica-ui` (on items)

---

#### Text

Typography component with multiple variants and admin mode.

**Import:**
```typescript
import { Text } from 'citrica-ui-toolkit';
```

**Props:**
- `children: React.ReactNode` - Text content (required)
- `variant?: 'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'label' | 'headlinecustom'` - Typography style (default: 'body')
- `weight?: 'light' | 'normal' | 'bold'` - Font weight (default: 'normal')
- `color?: string` - Custom color value
- `textColor?: string` - CSS variable name (default: 'color-black')
- `isAdmin?: boolean` - Use admin theme (default: false)
- `as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'` - HTML element (default: 'span')
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
// Basic text
<Text variant="body">This is body text</Text>

// Heading
<Text variant="headline" as="h1" weight="bold">
  Main Heading
</Text>

// Custom color
<Text color="#FF5733">Custom colored text</Text>

// With CSS variable
<Text textColor="color-primary">Primary color text</Text>

// Admin mode
<Text variant="label" isAdmin={true}>Admin text</Text>
```

**CSS Classes Applied:**
- `text-{variant}` or `text-{variant}-admin`
- `text-component`
- `text-{variant}-{weight}` (if weight is not 'normal')

---

#### Icon

Icon component using Lucide React icons library.

**Import:**
```typescript
import { Icon, type IconName } from 'citrica-ui-toolkit';
```

**Props:**
- `name: IconName` - Lucide icon name (required, e.g., "Home", "User", "Settings")
- `size?: number` - Icon size in pixels (default: 20)
- `strokeWidth?: number` - Stroke width (default: 2)
- `color?: string` - Icon color
- `fallback?: IconName` - Fallback icon if name not found (default: "AlertCircle")
- Plus all other Lucide icon props (className, etc.)

**Usage:**
```tsx
// Basic icon
<Icon name="Home" />

// Custom size and color
<Icon name="User" size={32} color="#FF5733" />

// With custom stroke
<Icon name="Settings" strokeWidth={3} />

// Common icon names
<Icon name="Mail" />
<Icon name="Lock" />
<Icon name="Search" />
<Icon name="ChevronDown" />
<Icon name="AlertCircle" />
<Icon name="Check" />
<Icon name="X" />
<Icon name="Menu" />
```

**Notes:**
- Uses all icons from `lucide-react` library
- Automatically falls back to AlertCircle if icon not found
- Fully typed with TypeScript autocomplete for icon names

---

#### Card

Container component with optional header and footer sections.

**Import:**
```typescript
import { Card } from 'citrica-ui-toolkit';
```

**Props:**
- `children: ReactNode` - Card body content (required)
- `header?: ReactNode` - Optional header content
- `footer?: ReactNode` - Optional footer content
- `shadow?: 'none' | 'sm' | 'md' | 'lg'` - Shadow depth (default: 'sm')
- `radius?: 'none' | 'sm' | 'md' | 'lg'` - Border radius (default: 'md')
- `variant?: 'shadow' | 'bordered' | 'light' | 'flat'` - Visual variant
- `isPressable?: boolean` - Make card clickable (default: false)
- `onPress?: () => void` - Click handler
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
// Basic card
<Card>
  <p>Card content here</p>
</Card>

// Card with header and footer
<Card
  header={<h3>Card Title</h3>}
  footer={<Button label="Action" />}
  shadow="md"
>
  <p>Card body content</p>
</Card>

// Clickable card
<Card isPressable onPress={() => console.log('clicked')}>
  <p>Click me</p>
</Card>
```

---

#### Textarea

Multi-line text input component.

**Import:**
```typescript
import { Textarea } from 'citrica-ui-toolkit';
```

**Props:**
- `label?: string` - Textarea label
- `placeholder?: string` - Placeholder text
- `value?: string` - Controlled value
- `defaultValue?: string` - Default value
- `onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void` - Change handler
- `onValueChange?: (value: string) => void` - Value change handler
- `name?: string` - Input name
- `variant?: 'primary' | 'secondary' | 'flat' | 'bordered' | 'faded' | 'underlined'` - Style (default: 'primary')
- `size?: 'sm' | 'md' | 'lg'` - Size (default: 'md')
- `radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'` - Border radius (default: 'md')
- `required?: boolean` - Required field
- `disabled?: boolean` - Disable textarea
- `readOnly?: boolean` - Read-only mode
- `isInvalid?: boolean` - Invalid state
- `errorMessage?: string` - Error message
- `description?: string` - Helper text
- `fullWidth?: boolean` - Full width (default: true)
- `autoFocus?: boolean` - Auto focus
- `maxLength?: number` - Max characters
- `minLength?: number` - Min characters
- `rows?: number` - Initial rows (default: 4)
- `minRows?: number` - Minimum rows
- `maxRows?: number` - Maximum rows (auto-grows)
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
// Basic textarea
<Textarea
  label="Description"
  placeholder="Enter description..."
  rows={6}
/>

// With validation
<Textarea
  label="Comments"
  isInvalid={true}
  errorMessage="Comments are required"
  maxLength={500}
/>

// Auto-growing textarea
<Textarea
  label="Message"
  minRows={3}
  maxRows={10}
/>
```

**CSS Classes Applied:**
- `textarea-citrica-ui`
- `textarea-primary` or `textarea-secondary`

---

#### Grid Components (Container & Col)

Responsive grid layout system.

**Import:**
```typescript
import { Container, Col } from 'citrica-ui-toolkit';
```

##### Container

**Props:**
- `children?: React.ReactNode` - Container content
- `className?: string` - Additional CSS classes
- `noPadding?: boolean` - Remove default padding (default: false)
- `noLimit?: boolean` - Remove max-width limit (default: false)

**Usage:**
```tsx
<Container>
  {/* Content here */}
</Container>

<Container noPadding noLimit>
  {/* Full width, no padding */}
</Container>
```

**CSS Classes Applied:**
- `o-container`
- `no-padding` (if noPadding)
- `no-width-limit` (if noLimit)

##### Col

**Props:**
- `cols: ColSizes` - Column sizes by breakpoint (required)
- `children?: React.ReactNode` - Column content
- `className?: string` - Additional CSS classes
- `noPadding?: boolean` - Remove default padding

**ColSizes Interface:**
```typescript
interface ColSizes {
  lg?: number;      // Large screens (12-column grid)
  md?: number;      // Medium screens (6-column grid)
  sm?: number;      // Small screens (4-column grid)
  lgPush?: number;  // Offset for large screens
  mdPush?: number;  // Offset for medium screens
  smPush?: number;  // Offset for small screens
}
```

**Usage:**
```tsx
// Responsive columns
<Container>
  <Col cols={{ lg: 6, md: 3, sm: 2 }}>
    Column 1
  </Col>
  <Col cols={{ lg: 6, md: 3, sm: 2 }}>
    Column 2
  </Col>
</Container>

// With offset
<Container>
  <Col cols={{ lg: 8, lgPush: 2 }}>
    Centered column with offset
  </Col>
</Container>
```

**CSS Classes Applied:**
- `o-col-{size}@lg`, `o-col-{size}@md`, `o-col-{size}@sm`
- `o-col-push-{size}@lg`, `o-col-push-{size}@md`, `o-col-push-{size}@sm`
- `no-padding` (if noPadding)

---

### MOLECULES

#### Modal

Modal dialog component with customizable content areas.

**Import:**
```typescript
import { Modal } from 'citrica-ui-toolkit';
```

**Props:**
- `isOpen: boolean` - Modal open state (required)
- `onClose: () => void` - Close handler (required)
- `title?: string` - Modal title
- `children?: React.ReactNode` - Modal body content
- `header?: React.ReactNode` - Custom header (overrides title)
- `footer?: React.ReactNode` - Footer content
- `size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'` - Modal size (default: 'md')
- `placement?: 'center' | 'top' | 'bottom' | 'top-center' | 'bottom-center'` - Position (default: 'center')
- `backdrop?: 'transparent' | 'opaque' | 'blur'` - Backdrop style (default: 'opaque')
- `scrollBehavior?: 'normal' | 'inside' | 'outside'` - Scroll behavior (default: 'normal')
- `hideCloseButton?: boolean` - Hide close button (default: false)
- `isDismissable?: boolean` - Allow dismiss by clicking outside (default: true)
- `className?: string` - Additional CSS classes
- `classNames?: object` - Custom classes for modal parts

**Usage:**
```tsx
const [isOpen, setIsOpen] = useState(false);

// Basic modal
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
>
  <p>Modal content here</p>
</Modal>

// Modal with footer
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  footer={
    <>
      <Button label="Cancel" variant="flat" onPress={() => setIsOpen(false)} />
      <Button label="Confirm" variant="primary" />
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>

// Large modal with blur backdrop
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  size="2xl"
  backdrop="blur"
  scrollBehavior="inside"
>
  <div>Large modal content...</div>
</Modal>
```

**Notes:**
- Automatically handles ESC key for closing
- Locks body scroll when open
- Accessible with keyboard navigation

---

#### Carousel

Image carousel/slider component using Swiper.

**Import:**
```typescript
import { Carousel, type CarouselItem } from 'citrica-ui-toolkit';
```

**Props:**
- `items: CarouselItem[]` - Array of carousel items (required)
- `autoplay?: boolean` - Enable autoplay (default: false)
- `autoplayDelay?: number` - Autoplay delay in ms (default: 3000)
- `showPagination?: boolean` - Show pagination dots (default: true)
- `showNavigation?: boolean` - Show prev/next arrows (default: false)
- `loop?: boolean` - Enable infinite loop (default: false)
- `className?: string` - Additional CSS classes
- `slideClassName?: string` - CSS classes for slides
- `breakpoints?: object` - Custom responsive breakpoints

**CarouselItem Interface:**
```typescript
interface CarouselItem {
  id: string;           // Unique identifier
  src: string;          // Image source URL
  alt: string;          // Image alt text
  title?: string;       // Optional title overlay
  description?: string; // Optional description overlay
}
```

**Usage:**
```tsx
const items = [
  { id: "1", src: "/img/slide1.jpg", alt: "Slide 1", title: "First Slide" },
  { id: "2", src: "/img/slide2.jpg", alt: "Slide 2" },
  { id: "3", src: "/img/slide3.jpg", alt: "Slide 3", description: "Description" }
];

// Basic carousel
<Carousel items={items} />

// Autoplay carousel
<Carousel
  items={items}
  autoplay={true}
  autoplayDelay={5000}
  loop={true}
/>

// Carousel with navigation
<Carousel
  items={items}
  showNavigation={true}
  showPagination={true}
/>

// Custom breakpoints
<Carousel
  items={items}
  breakpoints={{
    640: { slidesPerView: 1, spaceBetween: 10 },
    768: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 30 }
  }}
/>
```

**Default Breakpoints:**
- 640px: 1 slide, centered
- 768px: 1 slide, centered
- 1024px: 3 slides, not centered

**Notes:**
- Requires Swiper CSS imports (included in component)
- Supports title/description overlays on images

---

### ORGANISMS

#### Header

Responsive navigation header with multiple layout variants.

**Import:**
```typescript
import { Header, type NavItem } from 'citrica-ui-toolkit';
```

**Props:**
- `logo?: React.ReactNode` - Custom logo component
- `variant?: 'floating' | 'split' | 'basic'` - Layout variant (default: 'basic')
- `className?: string` - Additional CSS classes
- `showButton?: boolean` - Show CTA button (default: false)
- `buttonText?: string` - Button text (default: 'GET STARTED')
- `onButtonClick?: () => void` - Button click handler
- `navItems?: NavItem[]` - Navigation items (default: [])

**NavItem Interface:**
```typescript
interface NavItem {
  title: string;  // Display text
  href: string;   // Link or anchor (#section-id)
}
```

**Variants:**
- **basic**: Traditional header with left logo, right navigation
- **floating**: Floating centered navigation pill with transparent background
- **split**: Logo centered, navigation split left/right

**Usage:**
```tsx
const navItems = [
  { title: "Home", href: "#home" },
  { title: "About", href: "#about" },
  { title: "Services", href: "#services" },
  { title: "Contact", href: "#contact" }
];

// Basic header
<Header
  variant="basic"
  navItems={navItems}
  showButton={true}
  buttonText="Get Started"
/>

// Floating header (Matour style)
<Header
  variant="floating"
  logo={<img src="/logo.png" alt="Logo" />}
  navItems={navItems}
  showButton={true}
/>

// Split header (Flowblox style)
<Header
  variant="split"
  navItems={navItems}
  showButton={true}
  buttonText="Contact Us"
  onButtonClick={() => alert('CTA clicked')}
/>
```

**Features:**
- Responsive mobile menu with hamburger icon
- Smooth scroll to anchor links
- Background changes on scroll
- Fixed positioning with z-index 50

---

#### Footer

Footer component with logo, social links, and company info.

**Import:**
```typescript
import { Footer } from 'citrica-ui-toolkit';
```

**Props:**
- `logoSrc?: string` - Company logo URL (default: '/img/home/Logo-galiz.png')
- `logoAlt?: string` - Logo alt text (default: 'Logo')
- `companyName?: string` - Company name (default: 'Gáliz Perú')
- `year?: number` - Copyright year (default: current year)
- `developedByText?: string` - "Developed by" text (default: 'Desarrollado por')
- `devLogoSrc?: string` - Developer logo URL
- `devLogoAlt?: string` - Developer logo alt
- `socialLinks?: object` - Social media links
  - `instagram?: string`
  - `facebook?: string`
  - `linkedin?: string`
- `instagramIconSrc?: string` - Instagram icon URL
- `facebookIconSrc?: string` - Facebook icon URL
- `linkedinIconSrc?: string` - LinkedIn icon URL
- `height?: string` - Footer height (default: '204px')
- `backgroundColor?: string` - Background color (overrides gradient)
- `gradient?: string` - Background gradient (default: linear gradient)
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
// Basic footer
<Footer
  companyName="My Company"
  socialLinks={{
    instagram: "https://instagram.com/mycompany",
    facebook: "https://facebook.com/mycompany",
    linkedin: "https://linkedin.com/company/mycompany"
  }}
/>

// Custom footer
<Footer
  logoSrc="/my-logo.png"
  logoAlt="My Company"
  companyName="My Company Ltd"
  year={2024}
  developedByText="Built by"
  devLogoSrc="/dev-logo.png"
  backgroundColor="#0D1321"
  height="250px"
  socialLinks={{
    instagram: "https://instagram.com/...",
    linkedin: "https://linkedin.com/..."
  }}
/>
```

**Layout:**
- Uses Grid Container and Col for responsive layout
- 3 columns on large screens: logo, company info, social icons
- Responsive adjustments for mobile

---

#### Sidebar

Collapsible navigation sidebar with accordion support.

**Import:**
```typescript
import { Sidebar, type MenuItem } from 'citrica-ui-toolkit';
```

**Props:**
- `items: MenuItem[]` - Navigation items (required)
- `activeHref?: string` - Currently active main item
- `activeSubHref?: string` - Currently active sub-item
- `onItemClick?: (href: string) => void` - Item click handler
- `className?: string` - Additional CSS classes

**MenuItem Interface:**
```typescript
interface MenuItem {
  title: string;           // Item title
  href?: string;           // Link URL
  subItems?: SubMenuItem[]; // Optional sub-items (creates accordion)
}

interface SubMenuItem {
  title: string;  // Sub-item title
  href: string;   // Link URL
}
```

**Usage:**
```tsx
const menuItems = [
  { title: "Dashboard", href: "/dashboard" },
  {
    title: "Products",
    subItems: [
      { title: "All Products", href: "/products" },
      { title: "Add Product", href: "/products/add" },
      { title: "Categories", href: "/products/categories" }
    ]
  },
  { title: "Settings", href: "/settings" }
];

// Basic sidebar
<Sidebar
  items={menuItems}
  activeHref="/dashboard"
  onItemClick={(href) => router.push(href)}
/>

// Sidebar with active sub-item
<Sidebar
  items={menuItems}
  activeHref="/products"
  activeSubHref="/products/add"
  onItemClick={(href) => router.push(href)}
/>
```

**Features:**
- Responsive: drawer on mobile, fixed sidebar on desktop
- Accordion support for nested items
- Active state highlighting
- Automatic scroll on mobile drawer
- Overlay backdrop on mobile

**CSS Classes Applied:**
- `bg-sidebar` - Background color class for sidebar
- Uses custom classes defined in consuming app

---

## Styling

All components use custom CSS classes that should be defined in your application:

### Component Base Classes
- `btn-citrica-ui`, `btn-citrica-ui-admin`
- `input-citrica-ui`
- `select-citrica-ui`, `select-item-citrica-ui`
- `autocomplete-citrica-ui`, `autocomplete-item-citrica-ui`
- `textarea-citrica-ui`

### Variant Classes
- Button: `btn-primary`, `btn-secondary`, `btn-success`, `btn-warning`, `btn-danger`, `btn-flat`
- Admin variants: Add `-admin` suffix (e.g., `btn-primary-admin`)
- Input/Select/Textarea: `input-primary`, `input-secondary`, etc.

### Text Classes
- `text-display`, `text-headline`, `text-title`, `text-subtitle`, `text-body`, `text-label`
- Weight modifiers: `text-{variant}-light`, `text-{variant}-bold`
- Admin variants: Add `-admin` suffix

### Color Classes
- `color-black`, `color-white`
- `color-on-primary`, `color-on-secondary`, `color-on-success`, etc.
- Admin colors: `color-admin-on-primary`, etc.

### Grid Classes
- `o-container`, `no-padding`, `no-width-limit`
- `o-col-{1-12}@lg`, `o-col-{1-6}@md`, `o-col-{1-4}@sm`
- `o-col-push-{n}@{breakpoint}`

---

## TypeScript Support

All components are fully typed with TypeScript. Import types as needed:

```typescript
import type {
  ButtonProps,
  InputProps,
  SelectOption,
  AutocompleteOption,
  CarouselItem,
  NavItem,
  MenuItem
} from 'citrica-ui-toolkit';
```

---

## Important Notes

1. **Custom Variants**: Components with `primary` and `secondary` variants internally map to HeroUI's `bordered` variant for consistent custom styling
2. **Admin Mode**: Button and Text components support `isAdmin` prop for alternate color schemes
3. **Icon Names**: Icon component uses Lucide React icon names (e.g., "Home", "User", "Settings")
4. **Refs**: Input component uses `forwardRef` for compatibility with form libraries like react-hook-form
5. **CSS Requirements**: You must define custom CSS classes in your application for proper styling

---

## Build & Development

```bash
# Development mode (watch)
npm run dev

# Production build
npm run build
```

Build outputs to `dist/` with:
- `dist/index.js` (CommonJS)
- `dist/index.mjs` (ES Module)
- `dist/index.d.ts` (TypeScript definitions)

---

#### Login

Multi-mode authentication component with login, forgot password, and new password flows.

**Import:**
```typescript
import { Login, type LoginMode } from 'citrica-ui-toolkit';
```

**Props:**
- `mode?: LoginMode` - Display mode: 'login' | 'forgot-password' | 'new-password' (default: 'login')
- **Styling**
  - `bgImage?: string` - Background image URL for right section (default: '/img/login-form-image-lg.jpg')
  - `logo?: string` - Logo image URL (default: '/img/citrica-logo.png')
  - `logoAlt?: string` - Logo alt text (default: 'Logo')
  - `logoClassName?: string` - Logo CSS classes (default: 'w-[80px] pb-3 items-center')
  - `className?: string` - Additional CSS classes
- **Content - Login mode**
  - `title?: string` - Main title (default: '¡Bienvenido!')
  - `subtitle?: string` - Subtitle text (default: 'Ingresa tu correo electrónico y contraseña')
  - `emailLabel?: string` - Email input label (default: 'Email')
  - `passwordLabel?: string` - Password input label (default: 'Clave')
  - `emailPlaceholder?: string` - Email placeholder (default: 'Correo electrónico')
  - `passwordPlaceholder?: string` - Password placeholder (default: 'Contraseña')
  - `loginButtonText?: string` - Login button text (default: 'Iniciar sesión')
  - `loadingButtonText?: string` - Loading state text (default: 'Accediendo...')
- **Content - Forgot Password mode**
  - `forgotPasswordTitle?: string` - Title (default: '¿No puedes iniciar sesión?')
  - `forgotPasswordSubtitle?: string` - Subtitle
  - `forgotPasswordDescription?: string` - Description text
  - `sendLinkButtonText?: string` - Send link button text (default: 'Enviar enlace')
  - `sendingLinkButtonText?: string` - Sending state text (default: 'Enviando...')
  - `backToLoginText?: string` - Back to login link text (default: '¿Olvidaste tu contraseña?')
- **Content - New Password mode**
  - `newPasswordTitle?: string` - Title (default: 'Crea una nueva contraseña')
  - `newPasswordSubtitle?: string` - Subtitle
  - `newPasswordLabel?: string` - Password input label (default: 'Nueva contraseña')
  - `newPasswordPlaceholder?: string` - Password placeholder
  - `savePasswordButtonText?: string` - Save button text (default: 'Guardar contraseña')
  - `savingPasswordButtonText?: string` - Saving state text (default: 'Guardando...')
  - `cancelText?: string` - Cancel link text (default: 'Cancelar')
- **Actions - Login mode**
  - `onLogin?: (email: string, password: string) => Promise<{error?: boolean; message?: string}>` - Login handler
  - `onForgotPasswordClick?: () => void` - Forgot password click handler
- **Actions - Forgot Password mode**
  - `onSendResetLink?: (email: string) => Promise<{error?: boolean; message?: string}>` - Send reset link handler
  - `onBackToLogin?: () => void` - Back to login handler
- **Actions - New Password mode**
  - `onSaveNewPassword?: (password: string) => Promise<{error?: boolean; message?: string}>` - Save password handler
  - `onCancel?: () => void` - Cancel handler
- **Toggles**
  - `showForgotPassword?: boolean` - Show forgot password link (default: true)
- **Error messages**
  - `emptyFieldsError?: string` - Empty fields error (default: 'Por favor ingresa tu correo y contraseña')
  - `loginError?: string` - Login error (default: 'Correo o contraseña incorrectos')
  - `emptyEmailError?: string` - Empty email error
  - `resetLinkError?: string` - Reset link error
  - `emptyPasswordError?: string` - Empty password error
  - `savePasswordError?: string` - Save password error

**Usage:**
```tsx
"use client";
import { useState } from "react";
import { Login, LoginMode } from "citrica-ui-toolkit";

export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>("login");

  const handleLogin = async (email: string, password: string) => {
    // Your login logic
    const response = await yourAuthService.login(email, password);

    if (response.success) {
      return { error: false, message: "Login exitoso" };
    } else {
      return { error: true, message: "Email o contraseña incorrectos" };
    }
  };

  const handleForgotPasswordClick = () => {
    setMode("forgot-password");
  };

  const handleSendResetLink = async (email: string) => {
    // Your reset link logic
    await yourAuthService.sendResetLink(email);
    return { error: false, message: "Enlace enviado exitosamente" };
  };

  const handleBackToLogin = () => {
    setMode("login");
  };

  const handleSaveNewPassword = async (password: string) => {
    // Your save password logic
    await yourAuthService.savePassword(password);
    setMode("login");
    return { error: false, message: "Contraseña guardada" };
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <Login
        mode={mode}
        bgImage="https://your-image-url.com/background.jpg"
        logo="/your-logo.png"

        // Actions - Login mode
        onLogin={handleLogin}
        onForgotPasswordClick={handleForgotPasswordClick}

        // Actions - Forgot Password mode
        onSendResetLink={handleSendResetLink}
        onBackToLogin={handleBackToLogin}

        // Actions - New Password mode
        onSaveNewPassword={handleSaveNewPassword}
        onCancel={handleBackToLogin}
      />
    </div>
  );
}
```

**Features:**
- Three modes: login, forgot password, and new password
- Two-column layout: form on left, background image on right
- Responsive design (image hidden on mobile with `md:block`)
- Built-in password visibility toggle
- Input validation and error messages
- Loading states for async operations
- Inline CSS styling for consistent design
- Uses Input variant="faded" with custom classNames

**Layout:**
- Fixed width container (968px)
- Left section: White form container (484px max) with border and shadow
- Right section: Background image (484px max) with rounded corners
- Form uses gap-4 spacing between inputs and button

**Styling Notes:**
- Component has inline styles that don't require external CSS
- Form inputs use HeroUI's "faded" variant with custom colors:
  - Border: `#D4DEED`, hover: `#265197`
  - Labels: `#FF5B00` (orange)
  - Input text: `#265197` (blue)
  - Placeholder: `#A7BDE2` (light blue)

---

## License

ISC
