import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoundThousandsPipe } from './round-thousands.pipe';
import { ReplaceNullPipe } from './replace-null.pipe';
import { ReplaceFalseyPipe } from './replace-falsey.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [RoundThousandsPipe, ReplaceNullPipe, ReplaceFalseyPipe],
  exports: [RoundThousandsPipe, ReplaceNullPipe, ReplaceFalseyPipe],
})
export class CustomPipesModule {}
