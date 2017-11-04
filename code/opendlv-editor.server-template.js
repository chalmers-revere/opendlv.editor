/**
 * Copyright (C) 2017 Ola Benderius
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

var nunjucks = require('nunjucks');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

var values;
var outputDir;
var templateDir;

exports.begin = function(newTemplateDir, newOutputDir, newValues) 
{
  templateDir = newTemplateDir;
  outputDir = newOutputDir;
  values = newValues;

  nunjucks.configure(templateDir, {
    autoescape: true,
    cache: false
  });
}

exports.end = function()
{
  templateDir = undefined;
  outputDir = undefined;
  values = undefined;
}

exports.saveRootFile = function(sourceFile)
{
  exports.saveFile('.', sourceFile);
}

exports.saveFile = function(sourcePath, sourceFile)
{
  exports.copyRenamedFile(sourcePath, sourceFile, sourcePath, sourceFile);
}

exports.copyFile = function(sourcePath, sourceFile, destinationPath)
{
  exports.copyRenamedFile(sourcePath, sourceFile, destinationPath, sourceFile);
}

exports.saveRenamedFile = function(sourcePath, sourceFile, destinationFile)
{
  exports.copyRenamedFile(sourcePath, sourceFile, sourcePath, destinationFile);
}

exports.copyRenamedFile = function(sourcePath, sourceFile, destinationPath,
  destinationFile)
{
  const template = sourcePath + '/' + sourceFile;
  const res = nunjucks.render(template, values);

  const outputPath = outputDir + '/' + destinationPath;
  const outputFile = outputPath + '/' + destinationFile;

  mkdirp.sync(outputPath);
  fs.writeFileSync(outputFile, res);
}

exports.saveFolder = function(sourcePath)
{
  exports.copyFolder(sourcePath, sourcePath);
}

exports.copyFolder = function(sourcePath, destinationPath)
{
  const inputPath = templateDir + '/' + sourcePath;
  const outputPath = outputDir + '/' + destinationPath;
  copyFolderRecursiveSync(inputPath, outputPath);
}

function copyFileSync(source, destination) 
{
  var destinationFile = destination;

  if (fs.existsSync(destination)) {
    if (fs.lstatSync(destination).isDirectory()) {
      destinationFile = path.join(destination, path.basename(source));
    }
  }

  fs.writeFileSync(destinationFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, destination)
{
  if (!fs.existsSync(destination)) {
    mkdirp.sync(destination);
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(function (file) {
      const nextSource = path.join(source, file);
      if (fs.lstatSync(nextSource).isDirectory()) {
        const newDestination = path.join(destination, path.basename(nextSource));
        copyFolderRecursiveSync(nextSource, newDestination);
      } else {
        copyFileSync(nextSource, destination);
      }
    });
  }
}
