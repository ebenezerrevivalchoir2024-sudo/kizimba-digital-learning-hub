import { SavedNote, KDLHResource, NoteResource } from '../types';

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSingleNoteToTxt(note: SavedNote) {
  const sanitizeName = note.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
  const filename = `KDLH_Note_${sanitizeName}.txt`;

  const textContent = `===================================================================
KIZIMBA DIGITAL LEARNING HUB (KDLH) - STUDENT STUDY NOTE
===================================================================
Title: ${note.title}
Subject: ${note.subjectName}
Form / Level: ${note.form}
Date Created: ${note.dateCreated}
Sync Status: ${note.syncStatus.toUpperCase()}
Tags: ${note.tags ? note.tags.join(', ') : 'N/A'}
===================================================================

${note.content}

===================================================================
Exported from KDLH Offline Storage Vault for Local Review & Printing
Kizimba Secondary School Academic Portal
===================================================================`;

  downloadTextFile(filename, textContent);
}

export function exportAllNotesToTxt(notes: SavedNote[]) {
  if (notes.length === 0) return;

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `KDLH_All_Student_Notes_${dateStr}.txt`;

  let textContent = `===================================================================
KIZIMBA DIGITAL LEARNING HUB (KDLH) - COMPLETE STUDY NOTES COMPILATION
Export Date: ${dateStr}
Total Notes: ${notes.length}
===================================================================\n\n`;

  notes.forEach((note, index) => {
    textContent += `-------------------------------------------------------------------
NOTE #${index + 1}: ${note.title.toUpperCase()}
Subject: ${note.subjectName} | Level: ${note.form} | Date: ${note.dateCreated}
-------------------------------------------------------------------
${note.content}

\n`;
  });

  textContent += `===================================================================
End of Compilation • Kizimba Digital Learning Hub
===================================================================`;

  downloadTextFile(filename, textContent);
}

export function exportResourceToTxt(resource: KDLHResource) {
  const sanitizeName = resource.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
  const filename = `KDLH_Summary_${sanitizeName}.txt`;

  const noteMarkdown = resource.category === 'NOTE' ? (resource as NoteResource).contentMarkdown : '';

  const textContent = `===================================================================
KIZIMBA DIGITAL LEARNING HUB (KDLH) - ACADEMIC STUDY RESOURCE
===================================================================
Title: ${resource.title}
Category: ${resource.category.replace('_', ' ')}
Subject: ${resource.subjectName} (${resource.form})
Author: ${resource.author} (${resource.authorRole})
Date Added: ${resource.dateAdded}
License: ${resource.license || 'Academic Open Access'}
===================================================================

DESCRIPTION & OVERVIEW:
${resource.description}

${noteMarkdown ? `-------------------------------------------------------------------\nSTUDY CONTENT & KEY CONCEPTS:\n-------------------------------------------------------------------\n${noteMarkdown}\n` : ''}
===================================================================
Exported for Offline Printing and Local Review
Kizimba Digital Learning Hub (KDLH)
===================================================================`;

  downloadTextFile(filename, textContent);
}

export function exportSubjectFolderToTxt(subjectName: string, resources: KDLHResource[]) {
  if (resources.length === 0) return;

  const sanitizeName = subjectName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `KDLH_SubjectFolder_${sanitizeName}_${dateStr}.txt`;

  let textContent = `===================================================================
KIZIMBA DIGITAL LEARNING HUB (KDLH) - SUBJECT FOLDER COMPILATION
SUBJECT: ${subjectName.toUpperCase()}
Export Date: ${dateStr}
Total Resources: ${resources.length}
===================================================================\n\n`;

  resources.forEach((res, index) => {
    const noteMarkdown = res.category === 'NOTE' ? (res as NoteResource).contentMarkdown : '';
    textContent += `-------------------------------------------------------------------
RESOURCE #${index + 1}: ${res.title.toUpperCase()}
Type: ${res.category.replace('_', ' ')} | Level: ${res.form} | Author: ${res.author}
-------------------------------------------------------------------
Description: ${res.description}

${noteMarkdown ? `CONTENT:\n${noteMarkdown}\n` : ''}
\n`;
  });

  textContent += `===================================================================
End of ${subjectName} Subject Folder Compilation • Kizimba Digital Learning Hub
===================================================================`;

  downloadTextFile(filename, textContent);
}

