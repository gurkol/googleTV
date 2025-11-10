#!/bin/bash


# Stáhnutí všech větví
git fetch --all

# Získání seznamu všech vzdálených větví kromě HEAD a main
branches=$(git branch -r | grep -v '\->' | grep -v 'main' | sed 's/origin\///')

# Projití všech větví
for branch in $branches; do
    echo "Zpracovávám větev: $branch"
    
    # Checkout větve
    git checkout -B "$branch" "origin/$branch"
    
    # Merge main do větve
    git merge origin/main -m "Auto-merge main into $branch" || {
        echo "Konflikt při merge do $branch, přeskakuji..."
        git merge --abort
        continue
    }
    
    # Push změn
    git push origin "$branch"
done

# Návrat na main
git checkout main


git pull origin main
git add .
git commit -m "Auto-commit před merge"

for branch in $(git branch | grep -v "main" | grep -v "*"); do
  echo "Slučuji větev: $branch"
  git merge $branch --no-edit
  git branch -d $branch  # smaže lokální větev
done

git push origin main
echo "Hotovo!"



