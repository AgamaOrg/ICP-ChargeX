"use client";

import { Component, type ReactNode } from "react";

type MapErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

/**
 * The map component throws during render when MapLibre cannot start (no
 * WebGL, blocked script). Catch it here so the finder falls back to the list.
 */
export class MapErrorBoundary extends Component<MapErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
