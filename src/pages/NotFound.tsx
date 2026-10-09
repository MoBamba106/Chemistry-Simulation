/**
 * NotFound — friendly 404 with routes back home.
 */
import * as React from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="page">
      <EmptyState
        icon="🧭"
        title="Page not found"
        hint="That URL doesn't exist in this workspace. The simulations library and curriculum are good places to restart."
        action={
          <span style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/" className="btn btn-primary">Home</Link>
            <Link to="/sims" className="btn btn-outline">Simulations</Link>
            <Link to="/curriculum" className="btn btn-outline">Curriculum</Link>
          </span>
        }
      />
    </div>
  );
}
