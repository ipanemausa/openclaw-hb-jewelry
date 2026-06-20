.dashboard-wrapper {
  padding: 1rem;
}

/* GRID RESPONSIVE */
.dashboard-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.dash-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.dash-number {
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: .5rem;
}

.dashboard-section {
  margin-top: 2rem;
}

.activity-list {
  margin-top: .5rem;
  padding-left: 1rem;
}
