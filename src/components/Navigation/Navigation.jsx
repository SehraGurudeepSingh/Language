/**
 * Navigation Component
 * Modern navigation with glassmorphism effect and responsive design
 */

import React, { useState } from "react";
import { useTheme } from "../../hooks/useTheme.js";

export default function Navigation({ activeTab, onTabChange }) {
  const { themeObject, isDark } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "editor", label: "Editor", icon: "✎" },
    { id: "gallery", label: "Gallery", icon: "◈" },
    { id: "learn", label: "Learn", icon: "◎" },
  ];

  const styles = {
    nav: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: isDark
        ? "rgba(20, 22, 32, 0.85)"
        : "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: `1px solid ${
        isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.5)"
      }`,
      boxShadow: isDark
        ? "0 4px 30px rgba(0, 0, 0, 0.3)"
        : "0 4px 30px rgba(31, 38, 135, 0.1)",
    },
    navContainer: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "0 1.5rem",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    logo: {
      fontFamily: "'Jost', 'Inter', sans-serif",
      fontSize: "1.5rem",
      fontWeight: 600,
      background: `linear-gradient(135deg, ${themeObject.colors.semantic.sibilant} 0%, ${themeObject.colors.semantic.vowel} 100%)`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "0.08em",
      textDecoration: "none",
    },
    desktopNav: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    navItem: {
      padding: "0.625rem 1.25rem",
      borderRadius: "var(--radius-lg)",
      fontFamily: "var(--font-primary)",
      fontSize: "0.9375rem",
      fontWeight: 500,
      color: themeObject.colors.text.secondary,
      background: "transparent",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      position: "relative",
    },
    navItemActive: {
      color: themeObject.colors.semantic.sibilant,
      background: isDark
        ? "rgba(129, 140, 248, 0.15)"
        : "rgba(99, 102, 241, 0.1)",
    },
    navItemHover: {
      color: themeObject.colors.text.primary,
      background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
    },
    ctaButton: {
      padding: "0.625rem 1.5rem",
      borderRadius: "var(--radius-lg)",
      fontFamily: "var(--font-primary)",
      fontSize: "0.9375rem",
      fontWeight: 600,
      background: `linear-gradient(135deg, ${themeObject.colors.semantic.sibilant} 0%, ${themeObject.colors.semantic.vowel} 100%)`,
      color: "white",
      border: "none",
      cursor: "pointer",
      transition: "all 0.25s ease",
      boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
    },
    mobileMenuButton: {
      display: "none",
      padding: "0.5rem",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: themeObject.colors.text.primary,
      fontSize: "1.5rem",
    },
    mobileMenu: {
      display: isMobileMenuOpen ? "block" : "none",
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      background: isDark
        ? "rgba(20, 22, 32, 0.95)"
        : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(16px)",
      padding: "1rem",
      borderBottom: `1px solid ${themeObject.colors.border.light}`,
    },
    mobileNavItem: {
      display: "block",
      width: "100%",
      padding: "1rem",
      borderRadius: "var(--radius-lg)",
      fontFamily: "var(--font-primary)",
      fontSize: "1rem",
      fontWeight: 500,
      color: themeObject.colors.text.primary,
      background: "transparent",
      border: "none",
      cursor: "pointer",
      textAlign: "left",
      transition: "all 0.2s ease",
    },
  };

  // Media query styles inline for simplicity
  const mediaQuery = `
    @media (max-width: 768px) {
      .desktop-nav { display: none !important; }
      .mobile-menu-button { display: block !important; }
    }
    @media (min-width: 769px) {
      .mobile-menu { display: none !important; }
    }
  `;

  return (
    <>
      <style>{mediaQuery}</style>
      <nav style={styles.nav} role="navigation" aria-label="Main navigation">
        <div style={styles.navContainer}>
          {/* Logo */}
          <a href="#" style={styles.logo}>
            GLYPH STUDIO
          </a>

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={styles.desktopNav}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange && onTabChange(item.id)}
                style={{
                  ...styles.navItem,
                  ...(activeTab === item.id ? styles.navItemActive : {}),
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== item.id) {
                    Object.assign(e.target.style, styles.navItemHover);
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.id) {
                    e.target.style.background = "transparent";
                    e.target.style.color = themeObject.colors.text.secondary;
                  }
                }}
                aria-current={activeTab === item.id ? "page" : undefined}
              >
                <span style={{ marginRight: "0.5rem" }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="desktop-nav">
            <button
              style={styles.ctaButton}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(99, 102, 241, 0.3)";
              }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            style={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className="mobile-menu" style={styles.mobileMenu}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange && onTabChange(item.id);
                setIsMobileMenuOpen(false);
              }}
              style={{
                ...styles.mobileNavItem,
                ...(activeTab === item.id ? styles.navItemActive : {}),
              }}
            >
              <span style={{ marginRight: "0.75rem" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button
            style={{
              ...styles.mobileNavItem,
              marginTop: "0.5rem",
              background: `linear-gradient(135deg, ${themeObject.colors.semantic.sibilant} 0%, ${themeObject.colors.semantic.vowel} 100%)`,
              color: "white",
              textAlign: "center",
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get Started
          </button>
        </div>
      </nav>
    </>
  );
}
